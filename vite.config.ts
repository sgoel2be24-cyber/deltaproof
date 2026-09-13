import { defineConfig } from 'vite';
// Cross-origin isolation lets ONNX Runtime Web use multiple WASM threads.
const isolatedHeaders={ 'Cross-Origin-Opener-Policy':'same-origin', 'Cross-Origin-Embedder-Policy':'require-corp' };
export default defineConfig({ server:{ headers:isolatedHeaders }, preview:{ headers:isolatedHeaders } });
