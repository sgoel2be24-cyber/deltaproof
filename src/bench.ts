// Temporary benchmark page: WebGPU vs WASM for the seed workload. Not part of the app.
import { pipeline, env } from '@huggingface/transformers';
import { seed } from './seed';
import { cosine } from './engine';
const out = document.getElementById('out')!;
env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = '/models/';
const texts = ['Could customers download all their orders as a spreadsheet?', 'Let account owners invite colleagues with different permissions.', 'Please change the dashboard colors to match our new brand.', 'I forgot my password and need a way to reset it.', 'Export every order into a CSV file for our finance team.'];
const rows: string[] = [];
const browserVectors: Record<string, number[][]> = {};
const isolate = (self as unknown as { crossOriginIsolated?: boolean }).crossOriginIsolated;
rows.push(`crossOriginIsolated=${isolate} hardwareConcurrency=${navigator.hardwareConcurrency} webgpu=${'gpu' in navigator}`);
async function bench(name: string, device: 'wasm' | 'webgpu', dtype: 'q8' | 'fp32') {
  try {
    const t0 = performance.now();
    const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { device, dtype });
    const loadMs = performance.now() - t0;
    const t1 = performance.now();
    for (let r = 0; r < 3; r++) {
      const outputs = await Promise.all(texts.map(t => model(t, { pooling: 'mean', normalize: true })));
      if (r === 2) browserVectors[`${device}:${dtype}`] = outputs.map(o => Array.from(o.data) as number[]);
    }
    const inferMs = (performance.now() - t1) / 3;
    rows.push(`${device}:${dtype} load=${loadMs.toFixed(0)}ms infer19=${inferMs.toFixed(0)}ms (5 texts x3 runs)`);
  } catch (e) {
    rows.push(`${device}:${dtype} FAILED: ${String(e).slice(0, 120)}`);
  }
}
await bench('wasm', 'wasm', 'q8');
await bench('webgpu-q8', 'webgpu', 'q8');
await bench('webgpu-fp32', 'webgpu', 'fp32');
// parity: compare each device's vectors against wasm:q8 baseline
const base = browserVectors['wasm:q8'];
if (base) {
  for (const [key, vecs] of Object.entries(browserVectors)) {
    if (key === 'wasm:q8') continue;
    const devs = vecs.map((v, i) => 1 - cosine(v, base[i]));
    rows.push(`parity ${key} vs wasm:q8: max deviation=${Math.max(...devs).toExponential(2)}`);
  }
}
out.textContent = rows.join('\n');
document.title = 'BENCH-DONE';
export {};
