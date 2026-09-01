import json, http.server, socketserver

class H(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Headers','Content-Type, X-June-Key')
        self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS')
    def _json(self, code, obj):
        b = json.dumps(obj).encode()
        self.send_response(code); self._cors()
        self.send_header('Content-Type','application/json')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers(); self.wfile.write(b)
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_GET(self):
        if self.path == '/health':
            return self._json(200, {'ok':True,'anthropic':True,'pverify':True,
                                    'pverifyEnv':'sandbox','model':'claude-opus-5'})
        self._json(404, {'error':'nf'})
    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0)
        raw = self.rfile.read(n).decode() if n else '{}'
        try: payload = json.loads(raw)
        except Exception: return self._json(400, {'error':'bad json'})

        if self.path == '/chat':
            msgs = payload.get('messages') or []
            last = (msgs[-1].get('content') if msgs else '') or ''
            sysblob = json.dumps(payload.get('system'))
            # assertions the test reads back
            meta = {'sawKnowledge': 'Facts you may rely on' in sysblob,
                    'sawStepNotes': 'Design notes for this step' in sysblob,
                    'sawCache': 'cache_control' in sysblob,
                    'systemChars': len(sysblob),
                    # echoed so the tests can prove the client sends the
                    # shared-secret header the deployed Worker requires
                    'juneKey': self.headers.get('X-June-Key')}
            if 'GOODNUM' in last:
                # legitimate numbers that the ORIGINAL guardrail would have
                # rejected: a crisis line, a duration and a plan year
                text = ('This takes about 2 minutes.\n\n'
                        'Your 2026 plan covers telehealth, and if anything ever feels '
                        'urgent you can call 988.')
            elif 'BADNUM' in last:
                text = 'Your cost will be exactly $4321 this year.'
            elif 'SETFIELD' in last:
                text = 'Updated that for you.\n\n[[action: set_field: carrier = Humana]]'
            elif 'CHIPS' in last:
                text = 'Which card do you have?\n\n[[chips: Original Medicare | Medicare Advantage]]'
            else:
                text = 'Happy to help with that.'
            return self._json(200, {'id':'msg_mock','type':'message','role':'assistant',
                                    'model':payload.get('model'),
                                    'content':[{'type':'text','text':text}],
                                    'stop_reason':'end_turn',
                                    'usage':{'input_tokens':10,'output_tokens':5},
                                    '_mock':meta})
        if self.path == '/verify':
            sub = payload.get('subscriber') or {}
            self._last_key = self.headers.get('X-June-Key')
            if sub.get('memberID') == 'FAIL0000':
                self.send_response(500); self._cors(); self.end_headers()
                self.wfile.write(b'boom'); return
            # a live HMO response, in the real pVerify shape
            return self._json(200, {
                'APIResponseCode':'0','APIResponseMessage':'Processed',
                'IsPayerBackOffice':False,'IsHMOPlan':True,
                'PlanCoverageSummary':{'Status':'Active','PolicyType':'Medicare Advantage HMO',
                                       'PayerName':'LiveCarrier'},
                'HBPC_Deductible_OOP_Summary':{'IndividualDeductibleInNetRemaining':{'Value':'$0.00'}},
                'MedicareInfoSummary':{'AdvantagePayerName':'LiveCarrier','PharmacyPayerName':'LiveCarrier Part D'},
                'OtherPayerInfo':{'SecondaryPayer':''},
                'ServiceDetails':[{'ServiceName':'Telehealth','EligibilityDetails':[
                    {'CoPayment':'$0.00','CoInsurance':'0%','InNetwork':'Yes'}]}],
                '_echo': payload,
                '_juneKey': self.headers.get('X-June-Key'),
            })
        self._json(404, {'error':'nf'})
    def log_message(self,*a): pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('127.0.0.1', 8788), H) as s:
    s.serve_forever()
