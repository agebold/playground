"""Minimal Chrome DevTools Protocol driver for the fidelity harness.

Vendored into the prototype on purpose: verify-fidelity.py has to stay runnable
without anything in /tmp. Requires only `websocket-client` (pip install
websocket-client) plus Pillow and numpy for the diff itself.

`scale` is a launch flag, not a runtime override: an <img srcset> candidate is
selected once and Chrome does NOT re-select it after
Emulation.setDeviceMetricsOverride changes the DPR. The fidelity run needs DPR 1
so the 1x rasters are chosen and no resampling happens.
"""
import json, subprocess, time, urllib.request, os, base64, sys
import websocket

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 9333


class CDP:
    def __init__(self, url, width=393, height=852, port=PORT, profile="/tmp/cdp-profile", scale=1):
        subprocess.run(["pkill", "-f", "remote-debugging-port=%d" % port], capture_output=True)
        time.sleep(0.5)
        self.proc = subprocess.Popen([
            CHROME, "--headless=new", "--remote-debugging-port=%d" % port,
            "--user-data-dir=" + profile, "--no-first-run", "--no-default-browser-check",
            "--disable-gpu", "--hide-scrollbars", "--remote-allow-origins=*",
            "--force-device-scale-factor=%s" % scale,
            "--window-size=%d,%d" % (width, height), "about:blank",
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        ws_url = None
        for _ in range(60):
            try:
                data = json.load(urllib.request.urlopen("http://127.0.0.1:%d/json" % port))
                pages = [t for t in data if t["type"] == "page"]
                if pages:
                    ws_url = pages[0]["webSocketDebuggerUrl"]
                    break
            except Exception:
                pass
            time.sleep(0.25)
        if not ws_url:
            raise RuntimeError("Chrome did not expose a page target")
        self.ws = websocket.create_connection(ws_url, timeout=30)
        self.i = 0
        self.logs = []
        self.send("Runtime.enable")
        self.send("Log.enable")
        self.send("Page.enable")
        # MANDATORY, not hygiene. The profile persists in /tmp between runs and
        # http.server serves plain Last-Modified, so Chrome will happily hand back
        # a cached wm-*.js and the harness then verifies code that is no longer on
        # disk — reporting PASS or FAIL about the previous edit. This cost real
        # debugging time on the loader's progress bar.
        self.send("Network.enable")
        self.send("Network.setCacheDisabled", {"cacheDisabled": True})
        self.send("Emulation.setDeviceMetricsOverride",
                  {"width": width, "height": height, "deviceScaleFactor": scale, "mobile": True})
        self.goto(url)

    def send(self, method, params=None, timeout=30):
        self.i += 1
        mid = self.i
        self.ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
        deadline = time.time() + timeout
        while time.time() < deadline:
            self.ws.settimeout(max(0.1, deadline - time.time()))
            try:
                msg = json.loads(self.ws.recv())
            except websocket.WebSocketTimeoutException:
                break
            if msg.get("method") in ("Runtime.consoleAPICalled", "Log.entryAdded",
                                     "Runtime.exceptionThrown"):
                self.logs.append(msg)
            if msg.get("id") == mid:
                return msg
        raise TimeoutError(method)

    def pump(self, seconds=0.4):
        deadline = time.time() + seconds
        while time.time() < deadline:
            self.ws.settimeout(max(0.05, deadline - time.time()))
            try:
                msg = json.loads(self.ws.recv())
            except Exception:
                continue
            if msg.get("method") in ("Runtime.consoleAPICalled", "Log.entryAdded",
                                     "Runtime.exceptionThrown"):
                self.logs.append(msg)

    def goto(self, url):
        self.send("Page.navigate", {"url": url})
        time.sleep(1.4)
        self.pump(0.4)

    def js(self, expr, awaitp=False):
        r = self.send("Runtime.evaluate", {
            "expression": expr, "returnByValue": True, "awaitPromise": awaitp,
            "userGesture": True,
        })
        res = r.get("result", {})
        if "exceptionDetails" in res:
            det = res["exceptionDetails"]
            raise RuntimeError("JS error: %s" % json.dumps(det.get("exception", det))[:600])
        return res.get("result", {}).get("value")

    def shot(self, path, full=False):
        params = {"format": "png"}
        if full:
            params["captureBeyondViewport"] = True
        r = self.send("Page.captureScreenshot", params)
        with open(path, "wb") as f:
            f.write(base64.b64decode(r["result"]["data"]))
        return path

    def errors(self):
        out = []
        for m in self.logs:
            if m["method"] == "Runtime.exceptionThrown":
                d = m["params"]["exceptionDetails"]
                out.append("EXCEPTION: " + (d.get("exception", {}).get("description")
                                            or d.get("text", "?")))
            elif m["method"] == "Log.entryAdded":
                e = m["params"]["entry"]
                if e["level"] in ("error", "warning"):
                    out.append("%s: %s %s" % (e["level"].upper(), e.get("text", ""), e.get("url", "")))
            elif m["method"] == "Runtime.consoleAPICalled":
                p = m["params"]
                if p["type"] in ("error", "warning"):
                    txt = " ".join(str(a.get("value", a.get("description", ""))) for a in p.get("args", []))
                    out.append("CONSOLE-%s: %s" % (p["type"].upper(), txt))
        return out

    def close(self):
        try:
            self.ws.close()
        except Exception:
            pass
        self.proc.terminate()
