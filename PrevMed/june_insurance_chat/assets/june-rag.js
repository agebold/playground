/* ==========================================================================
   june-rag.js — knowledge store + retrieval
   --------------------------------------------------------------------------
   Strategy (chosen deliberately over embeddings for a prototype):

     corpus <= INLINE_BUDGET tokens  ->  inline every document whole, and mark
                                         the block cacheable so repeat turns are
                                         cheap. Highest fidelity: Claude sees
                                         everything, nothing is lost to a bad
                                         retrieval score.

     corpus >  INLINE_BUDGET tokens  ->  split on markdown headings, score
                                         chunks against the live question with a
                                         BM25-ish keyword scorer, inject top-K.

   Storage is IndexedDB. localStorage would blow its ~5MB quota on a handful of
   real documents, and silently — which is the worst failure mode for a tool
   whose whole job is holding your knowledge base.
   ========================================================================== */

(function (global) {
  'use strict';

  var DB_NAME = 'june-insurance-chat';
  var DB_VERSION = 1;
  var STORE = 'docs';

  // ~4 chars/token is close enough for a budget gauge; we are not billing on it.
  var CHARS_PER_TOKEN = 4;
  var INLINE_BUDGET = 12000;   // tokens of knowledge we're happy to inline
  var TOP_K = 6;               // chunks injected in retrieval mode

  /* ---- IndexedDB ------------------------------------------------------- */

  var OPEN_TIMEOUT_MS = 1200;

  function open() {
    return new Promise(function (resolve, reject) {
      if (!global.indexedDB) { reject(new Error('IndexedDB unavailable')); return; }
      // A blocked upgrade, private-mode restriction, or a storage-starved
      // environment can leave indexedDB.open() pending forever. A hung store
      // must never hang a conversation turn, so bound it.
      var settled = false;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error('IndexedDB open timed out'));
      }, OPEN_TIMEOUT_MS);
      function finish(fn, arg) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        fn(arg);
      }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = function () { finish(resolve, req.result); };
      req.onerror = function () { finish(reject, req.error); };
      req.onblocked = function () { finish(reject, new Error('IndexedDB blocked')); };
    });
  }

  function tx(mode, fn) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(STORE, mode);
        var store = t.objectStore(STORE);
        var out = fn(store);
        t.oncomplete = function () { db.close(); resolve(out && out.result !== undefined ? out.result : out); };
        t.onerror = function () { db.close(); reject(t.error); };
      });
    });
  }

  function listDocs() {
    return tx('readonly', function (s) { return s.getAll(); })
      .then(function (r) { return (r || []).sort(function (a, b) { return a.name.localeCompare(b.name); }); });
  }
  function putDoc(doc) { return tx('readwrite', function (s) { return s.put(doc); }); }
  function deleteDoc(id) { return tx('readwrite', function (s) { return s.delete(id); }); }
  function clearDocs() { return tx('readwrite', function (s) { return s.clear(); }); }

  function addDoc(name, text, origin) {
    var doc = {
      id: 'doc_' + Date.now() + '_' + Math.floor(Math.random() * 1e6),
      name: name,
      text: String(text || ''),
      origin: origin || 'upload',
      enabled: true,
      addedAt: new Date().toISOString(),
    };
    return putDoc(doc).then(function () { return doc; });
  }

  /* ---- Chunking -------------------------------------------------------- */

  /** Split on markdown headings so a chunk is a coherent idea, not N chars. */
  function chunk(doc) {
    var lines = doc.text.split(/\r?\n/);
    var out = [];
    var heading = doc.name;
    var buf = [];

    function flush() {
      var body = buf.join('\n').trim();
      if (body) {
        out.push({
          docId: doc.id,
          docName: doc.name,
          heading: heading,
          text: body,
          tokens: estimateTokens(body),
        });
      }
      buf = [];
    }

    for (var i = 0; i < lines.length; i++) {
      var m = /^(#{1,6})\s+(.*)$/.exec(lines[i]);
      if (m) { flush(); heading = m[2].trim(); }
      else { buf.push(lines[i]); }
    }
    flush();

    // A heading with no body still carries meaning as a label; drop only empties.
    return out.filter(function (c) { return c.text.length > 2; });
  }

  function estimateTokens(s) { return Math.ceil(String(s || '').length / CHARS_PER_TOKEN); }

  /* ---- Scoring --------------------------------------------------------- */

  var STOP = new Set(('a an and are as at be but by can do does for from has have how i if in is it its me my '
    + 'of on or our so that the their there they this to up was we what when where which who will with you your')
    .split(' '));

  function terms(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9$%\s-]/g, ' ')
      .split(/\s+/)
      .filter(function (w) { return w.length > 2 && !STOP.has(w); });
  }

  /**
   * BM25-ish: idf-weighted term frequency with length normalisation, plus a
   * bonus when the term appears in the chunk's heading (headings are dense
   * signal in hand-written knowledge docs).
   */
  function score(chunks, query) {
    var q = terms(query);
    if (!q.length) return [];

    var N = chunks.length || 1;
    var df = Object.create(null);
    var prepped = chunks.map(function (c) {
      var t = terms(c.text + ' ' + c.heading);
      var tf = Object.create(null);
      t.forEach(function (w) { tf[w] = (tf[w] || 0) + 1; });
      Object.keys(tf).forEach(function (w) { df[w] = (df[w] || 0) + 1; });
      return { chunk: c, tf: tf, len: t.length || 1, head: terms(c.heading) };
    });

    var avgLen = prepped.reduce(function (a, p) { return a + p.len; }, 0) / N;
    var k1 = 1.2, b = 0.75;

    return prepped.map(function (p) {
      var s = 0;
      q.forEach(function (w) {
        var f = p.tf[w] || 0;
        if (!f) return;
        var idf = Math.log(1 + (N - (df[w] || 0) + 0.5) / ((df[w] || 0) + 0.5));
        s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * (p.len / (avgLen || 1))));
        if (p.head.indexOf(w) !== -1) s += idf * 0.6;
      });
      return { chunk: p.chunk, score: s };
    })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b2) { return b2.score - a.score; });
  }

  /* ---- Build the knowledge block for a turn --------------------------- */

  /**
   * @returns {{mode:'inline'|'retrieval'|'empty', text:string, tokens:number,
   *            used:Array<{docName:string,heading:string,score:number}>,
   *            corpusTokens:number}}
   */
  async function build(query, opts) {
    opts = opts || {};
    var budget = opts.inlineBudget || INLINE_BUDGET;
    var topK = opts.topK || TOP_K;

    var docs = (await listDocs()).filter(function (d) { return d.enabled !== false; });
    if (!docs.length) {
      return { mode: 'empty', text: '', tokens: 0, used: [], corpusTokens: 0 };
    }

    var corpusTokens = docs.reduce(function (a, d) { return a + estimateTokens(d.text); }, 0);

    if (corpusTokens <= budget) {
      var body = docs.map(function (d) {
        return '### ' + d.name + '\n' + d.text.trim();
      }).join('\n\n');
      return {
        mode: 'inline',
        text: body,
        tokens: estimateTokens(body),
        used: docs.map(function (d) { return { docName: d.name, heading: '(whole document)', score: null }; }),
        corpusTokens: corpusTokens,
      };
    }

    var all = [];
    docs.forEach(function (d) { all = all.concat(chunk(d)); });
    var ranked = score(all, query).slice(0, topK);

    if (!ranked.length) {
      return { mode: 'retrieval', text: '', tokens: 0, used: [], corpusTokens: corpusTokens };
    }

    var text = ranked.map(function (r) {
      return '### ' + r.chunk.docName + ' — ' + r.chunk.heading + '\n' + r.chunk.text;
    }).join('\n\n');

    return {
      mode: 'retrieval',
      text: text,
      tokens: estimateTokens(text),
      used: ranked.map(function (r) {
        return { docName: r.chunk.docName, heading: r.chunk.heading, score: Math.round(r.score * 100) / 100 };
      }),
      corpusTokens: corpusTokens,
    };
  }

  /** First-run seed: pull the shipped knowledge/*.md into the store. */
  async function seed(files) {
    var existing = await listDocs();
    var have = new Set(existing.map(function (d) { return d.name; }));
    var added = [];
    for (var i = 0; i < files.length; i++) {
      var name = files[i].split('/').pop();
      if (have.has(name)) continue;
      try {
        var r = await fetch(files[i]);
        if (!r.ok) continue;
        var text = await r.text();
        added.push(await addDoc(name, text, 'seed'));
      } catch (e) { /* file:// origins block fetch — paste-in still works */ }
    }
    return added;
  }

  global.JuneRAG = {
    INLINE_BUDGET: INLINE_BUDGET,
    TOP_K: TOP_K,
    listDocs: listDocs,
    addDoc: addDoc,
    putDoc: putDoc,
    deleteDoc: deleteDoc,
    clearDocs: clearDocs,
    chunk: chunk,
    score: score,
    build: build,
    seed: seed,
    estimateTokens: estimateTokens,
  };
})(window);
