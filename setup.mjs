// Runs in the GitHub workflow: bundles the face engine, the face model and the video exporter into ./vendor
import fs from 'node:fs';
const src = 'node_modules/@mediapipe/tasks-vision', dst = 'vendor';
fs.mkdirSync(dst, { recursive: true });
fs.copyFileSync(src + '/vision_bundle.mjs', dst + '/vision_bundle.mjs');
fs.cpSync(src + '/wasm', dst + '/wasm', { recursive: true });
const r = await fetch('https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task');
if (!r.ok) throw new Error('Model download failed (' + r.status + ')');
fs.writeFileSync(dst + '/face_landmarker.task', Buffer.from(await r.arrayBuffer()));
const mx = 'node_modules/mp4-muxer/build';
const f = fs.existsSync(mx) ? fs.readdirSync(mx).find(n => n.endsWith('.mjs')) : null;
if (f) fs.copyFileSync(mx + '/' + f, dst + '/mp4-muxer.mjs'); else console.warn('mp4-muxer not bundled; the page will use the internet copy');
