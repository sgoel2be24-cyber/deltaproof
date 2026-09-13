// Temporary CDP driver for bench.html — not part of the app.
const port = process.argv[2] || '9222';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function main() {
  let target;
  for (let i = 0; i < 30; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = list.find(t => t.type === 'page' && t.url.includes('bench.html'));
      if (target) break;
    } catch {}
    await sleep(500);
  }
  if (!target) throw new Error('bench target not found');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const call = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async (expr) => {
    const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return r.result?.result?.value;
  };
  for (let i = 0; i < 240; i++) {
    const title = await evalJs('document.title');
    if (title === 'BENCH-DONE') break;
    await sleep(1000);
  }
  const text = await evalJs('document.getElementById("out").textContent');
  console.log(text);
  ws.close();
  process.exit(0);
}
main().catch(e => { console.error('DRIVER ERROR:', e.message); process.exit(1); });
