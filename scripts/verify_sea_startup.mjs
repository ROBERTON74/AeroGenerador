import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

// Exercise the actual component with a delayed loader and deterministic hooks.
// No WebGL or network is needed to verify the startup handoff and error path.
const source = (await readFile('src/components/BlenderSea.jsx', 'utf8'))
  .replace(/^import .*;\r?\n/gm, '')
  .replace('export default function', 'function');
const { code } = await transform(source, { loader: 'jsx', jsxFactory: 'element' });
const create = new Function('useEffect', 'useRef', 'useState', 'useFrame', 'useThree', 'loadBlenderSea', 'MODEL_SCALE', 'element', `${code}; return BlenderSea;`);

function harness() {
  let cursor = 0, slots = [], effect, cleanup, frame, resolve, reject, options;
  const statuses = [], canvas = { dataset: {} }, fallback = { name: 'old sea' };
  const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
  const ref = initial => { const index = cursor++; return slots[index] ??= { current: initial }; };
  const state = initial => { const index = cursor++; if (!(index in slots)) slots[index] = initial; return [slots[index], value => { slots[index] = value; }]; };
  const Component = create(fn => { effect ??= fn; }, ref, state, fn => { frame = fn; },
    () => ({ gl: { domElement: canvas } }), opts => { options = opts; return promise; }, 1,
    (type, props) => ({ type, props }));
  const props = { fallback, onStatusChange: status => statuses.push(status) };
  return {
    statuses, canvas, fallback, resolve, reject, props,
    render() { cursor = 0; return Component(props); },
    mount() { cleanup = effect(); },
    tick() { frame({ camera: { position: {} } }, .016); },
    unmount() { cleanup(); },
    get options() { return options; },
  };
}

globalThis.document = { hidden: false };
const flush = () => new Promise(resolve => setImmediate(resolve));
const h = harness();
assert.equal(h.render(), null);
h.mount();
assert.equal(h.render(), null, 'Do not show the old sea while assets are pending');
assert.deepEqual(h.statuses, ['loading']);
let updates = 0, disposed = 0;
const sea = { userData: { seaTime: 0 }, update() { updates++; }, dispose() { disposed++; } };
h.resolve(sea);await flush();
assert.deepEqual(h.statuses, ['loading'], 'Do not uncover the scene before the sea is mounted');
const mounted = h.render();
assert.equal(mounted.type, 'primitive');assert.equal(mounted.props.object, sea);
h.tick();h.tick();
assert.deepEqual(h.statuses, ['loading', 'ready'], 'Ready is emitted once from the mounted render loop');
assert.equal(updates, 2);assert.equal(h.canvas.dataset.seaSpeed, '0.75');
h.unmount();assert(h.options.signal.aborted);assert.equal(disposed, 1);

const failed = harness();failed.render();failed.mount();
const originalError = console.error;console.error = () => {};
try { failed.reject(Error('network failure'));await flush(); } finally { console.error = originalError; }
assert.equal(failed.render(), failed.fallback);
assert.deepEqual(failed.statuses, ['loading', 'error']);failed.unmount();

const cancelled = harness();cancelled.render();cancelled.mount();cancelled.unmount();
cancelled.resolve(sea);await flush();
assert.deepEqual(cancelled.statuses, ['loading']);assert.equal(disposed, 2);
console.log('PASS: delayed ocean, mounted handoff, 0.75 speed, network failure, unmount cancellation');
