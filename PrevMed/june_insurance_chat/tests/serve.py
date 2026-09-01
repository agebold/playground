#!/usr/bin/env python3
"""Static server for the June test suite.

Two reasons the tests can't use `python3 -m http.server` alone:
  * the pages must be served over http:// — IndexedDB and fetch() are blocked
    on file:// origins;
  * three suites need REAL wall-clock time. Chrome's --virtual-time-budget
    fast-forwards timers but starves IndexedDB, so those suites hold the load
    event open with <img src="/__delay=N"> and this server sleeps N seconds
    before answering.

    python3 PrevMed/june_insurance_chat/tests/serve.py     # serves repo root on :8099
"""
import http.server, socketserver, time, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8099
os.chdir(ROOT)

class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/__delay'):
            try:
                secs = float(self.path.split('=')[1])
            except Exception:
                secs = 5.0
            time.sleep(min(secs, 60))
            self.send_response(200)
            self.send_header('Content-Type', 'image/gif')
            self.send_header('Content-Length', '43')
            self.end_headers()
            self.wfile.write(bytes.fromhex(
                '47494638396101000100800000000000ffffff21f90401'
                '000000002c00000000010001000002024401003b'))
            return
        return super().do_GET()

    def log_message(self, *a):
        pass

socketserver.TCPServer.allow_reuse_address = True
print('serving %s on http://localhost:%d' % (ROOT, PORT))
with socketserver.ThreadingTCPServer(('127.0.0.1', PORT), H) as s:
    s.serve_forever()
