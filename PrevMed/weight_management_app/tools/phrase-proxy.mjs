/**
 * Phrasing proxy for mvp4-side-effect-triage.html, approach D.
 *
 * WHY THIS EXISTS
 * The prototype is a static HTML file. A browser must never hold an Anthropic
 * API key, so the key lives here instead and the page calls localhost.
 *
 * WHAT IT IS ALLOWED TO DO
 * Reword ONE already-written sentence. Nothing else. It never sees a triage
 * tier, never sees the disposition, and is never asked to decide anything —
 * every clinical decision is made by the deterministic rules in the HTML file,
 * which were transcribed from the clinician escalation table.
 *
 * The client re-validates whatever comes back (assertSafePhrasing) and falls
 * back to its own pre-authored string on any doubt, so this service failing —
 * or being off entirely — changes the wording and nothing else.
 *
 *   npm install @anthropic-ai/sdk
 *   ANTHROPIC_API_KEY=sk-... node tools/phrase-proxy.mjs
 *
 * then open:  mvp4-side-effect-triage.html?v=D&llm=1
 */

import { createServer } from 'node:http';
import Anthropic from '@anthropic-ai/sdk';

const PORT = Number(process.env.PORT || 8787);

// Resolves ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, or an `ant auth login` profile.
const client = new Anthropic();

const PHRASING_CONTRACT = `You reword one sentence for a health app used by adults over 65.

You are a COPY EDITOR, not a clinician. You never make or change a clinical
decision. The sentence you are given has already been approved; your only job is
to make it warmer and plainer to read.

Rules, all of them hard:
- Return ONE sentence (two at the very most), under 160 characters.
- If the input is a question, return exactly one question. If it is a
  statement, return a statement with no question mark.
- Aim at a 5th-grade reading level. Short words. Short clauses.
- Warm and calm, like a nurse who knows the person. Never chirpy, never alarming.
- Change NO clinical content. Do not add or remove a symptom, a body part, a
  number, a count, a timeframe, a threshold, a medication, or any advice.
- Never name a condition or a cause. Never say "you have", "this is",
  "it sounds like", "probably", or "likely". You are not diagnosing.
- Never mention urgency, seriousness, or emergencies. That wording is decided
  elsewhere and is not yours to introduce.
- No markdown, no quotes, no XML or HTML tags, no preamble, no explanation.
  Output only the reworded sentence.

If you cannot follow every rule, return the input sentence unchanged.`;

function send(res, code, body) {
  res.writeHead(code, {
    'content-type': 'application/json',
    // localhost only — this is a local dev aid, not a deployable service
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST, OPTIONS'
  });
  res.end(JSON.stringify(body));
}

createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST' || !req.url.startsWith('/phrase')) {
    return send(res, 404, { error: 'POST /phrase' });
  }

  let raw = '';
  req.on('data', (c) => {
    raw += c;
    if (raw.length > 4096) req.destroy();          // nothing legitimate is this big
  });

  req.on('end', async () => {
    let base, context;
    try {
      ({ base, context } = JSON.parse(raw));
    } catch {
      return send(res, 400, { error: 'bad json' });
    }
    if (typeof base !== 'string' || !base.trim()) {
      return send(res, 400, { error: 'base required' });
    }

    try {
      const msg = await client.messages.create({
        model: 'claude-opus-5',
        max_tokens: 256,
        output_config: { effort: 'low' },           // a one-line rewrite; GA, no beta header
        system: PHRASING_CONTRACT,
        messages: [{
          role: 'user',
          content: `Sentence to reword:\n${base}\n\nWhat it is for: ${context || 'a check-in question'}`
        }]
      });

      // Claude Opus 5 can decline; check stop_reason before reading content.
      if (msg.stop_reason === 'refusal') {
        console.warn('refusal:', msg.stop_details?.category);
        return send(res, 200, { text: base });
      }

      const text = msg.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .trim();

      console.log(`${text === base ? '=' : '~'} ${base}\n  -> ${text}`);
      return send(res, 200, { text: text || base });
    } catch (err) {
      // Any failure returns the original, so the flow is never blocked.
      console.error('phrase failed:', err?.message || err);
      return send(res, 200, { text: base });
    }
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`phrase proxy on http://localhost:${PORT}/phrase  (model: claude-opus-5)`);
  console.log('open: mvp4-side-effect-triage.html?v=D&llm=1');
});
