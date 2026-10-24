import test from 'node:test';
import assert from 'node:assert/strict';
import { monitorSite, summary } from './monitor_public_site.mjs';

const now = new Date('2026-10-24T12:00:00Z');
const video = '/portal/assets/media/blender_pitch_mordida_10s_4k_30fps.mp4';
const resources = ['/model.glb', video];
const json = value => Response.json(value);
function server({ broken, stale = false, fallback = true, badRange = false, transient = false, htmlAsset = false } = {}) {
  const calls = new Map();
  const fetchImpl = async (url, options) => {
    const path = new URL(url).pathname;
    const key = options.method + ' ' + path;
    calls.set(key, (calls.get(key) ?? 0) + 1);
    if (path === broken) return new Response('unavailable', { status: 503 });
    if (path === '/model.glb' && transient && calls.get(key) === 1) throw Error('network error');
    if (path.startsWith('/esios-api/')) return json({ indicator: { id: 551, values: [{ value: 0, datetime: stale ? '2026-10-20T12:00:00Z' : now.toISOString() }] } });
    if (path.startsWith('/ree-api/')) return fallback ? json({ included: [{ attributes: { title: 'Eólica', values: [{ value: 80000, datetime: '2026-10-23T00:00:00+02:00' }] } }] }) : new Response('', { status: 500 });
    if (options.method === 'HEAD') return new Response(null, { headers: { 'content-type': htmlAsset && path === '/model.glb' ? 'text/html' : 'application/octet-stream' } });
    if (path === video) return new Response(Buffer.from('ftyp____moov____'), { status: badRange ? 200 : 206 });
    const html = path === '/' ? '<div id="root"></div><script src="/assets/current.js"></script>' : '<app-root></app-root><script src="main-current.js"></script>';
    return new Response(html, { headers: { 'content-type': 'text/html' } });
  };
  return { fetchImpl, calls };
}
const run = (fake, options = {}) => monitorSite({ now, resources, attempts: 1, retryDelay: 0, fetchImpl: fake.fetchImpl, ...options });

test('checks pages, deployed hashed scripts, models, video seeking and zero generation', async () => {
  const fake = server();const report = await run(fake);
  assert(report.ok);assert.equal(report.dataSource, 'ESIOS');
  assert(fake.calls.has('HEAD /assets/current.js'));
  assert(fake.calls.has('HEAD /portal/main-current.js'));
  assert(fake.calls.has('GET ' + video));
});
test('missing model or fake HTML cannot be a healthy result', async () => {
  for (const options of [{ broken: '/model.glb' }, { htmlAsset: true }]) {
    const report = await run(server(options));assert(!report.ok);
    assert(report.failed.some(check => check.path === '/model.glb'));
  }
});
test('retries a transient network failure', async () => {
  const report = await run(server({ transient: true }), { attempts: 2 });
  assert(report.ok);assert.equal(report.checks.find(check => check.path === '/model.glb').attempts, 2);
});
test('stale ESIOS uses real REData without marking the entire site down', async () => {
  const report = await run(server({ stale: true }));
  assert(report.ok);assert.equal(report.dataSource, 'REData');assert.equal(report.warnings.length, 1);
});
test('failure of both data sources is detected', async () => {
  const report = await run(server({ stale: true, fallback: false }));
  assert(!report.ok);assert(report.failed.some(check => check.path.startsWith('/ree-api/')));
});
test('broken mobile video range support fails the monitor', async () => {
  const report = await run(server({ badRange: true }));
  assert(!report.ok);assert.match(summary(report), /reproducción por tramos/);
});
test('an unavailable portal is detected even if the main application works', async () => {
  const report = await run(server({ broken: '/portal/' }));
  assert(!report.ok);assert(report.failed.some(check => check.path === '/portal/'));
});
