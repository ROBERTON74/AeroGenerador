import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_ORIGIN = 'https://aerogenerador-robert.vercel.app';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Monitor availability and the published runtime files, without downloading
// large models on every hourly run. This is not a visual/GPU browser test.
export async function monitorSite({ origin = DEFAULT_ORIGIN, resources,
  fetchImpl = fetch, now = new Date(), attempts = 3, retryDelay = 1000, timeout = 8000 } = {}) {
  origin = new URL(origin).origin;
  resources ??= JSON.parse(await readFile(new URL('./monitor_resources.json', import.meta.url), 'utf8'));
  const checks = [], warnings = [];
  async function probe(path, { method = 'HEAD', headers, validate } = {}) {
    const url = new URL(path, origin);
    if (url.origin !== origin) throw Error('El monitor solo consulta el dominio configurado.');
    let error;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const response = await fetchImpl(url.href, { method, headers, signal: AbortSignal.timeout(timeout) });
        if (!response.ok) throw Error(`HTTP ${response.status}`);
        if (response.url && new URL(response.url).origin !== origin) throw Error('Redirección fuera del dominio');
        const details = validate ? await validate(response) : undefined;
        return { path, ok: true, status: response.status, attempts: attempt, ...details };
      } catch (failure) {
        error = failure.message;
        if (attempt < attempts) await sleep(retryDelay * attempt);
      }
    }
    return { path, ok: false, attempts, error };
  }
  const discovered = new Set(resources);
  for (const [path, marker] of [['/', 'id="root"'], ['/portal/', '<app-root']]) {
    const result = await probe(path, { method: 'GET', validate: async response => {
      if (!response.headers.get('content-type')?.includes('text/html')) throw Error('La portada no es HTML');
      const html = await response.text();
      if (!html.includes(marker)) throw Error('No aparece la aplicación esperada');
      const base = new URL(path, origin);
      for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/gi)) {
        const asset = new URL(match[1], base);
        if (asset.origin === origin) discovered.add(asset.pathname + asset.search);
      }
    } });
    checks.push(result);
  }
  if (checks.some(check => check.ok)) {
    const paths = [...discovered];let next = 0;
    await Promise.all(Array.from({ length: Math.min(6, paths.length) }, async () => {
      while (next < paths.length) {
        const path = paths[next++];
        checks.push(await probe(path, { validate: response => {
          if (!path.endsWith('.html') && response.headers.get('content-type')?.includes('text/html')) {
            throw Error('Se devuelve una página HTML en lugar del recurso');
          }
          const size = response.headers.get('content-length');
          if (size !== null && Number(size) === 0) throw Error('Recurso vacío');
        } }));
      }
    }));
    // Only these three files are embedded in the portal; historical files may
    // still exist as downloads without the same startup requirements.
    const embeddedVideos = ['blender_pitch_mordida_10s_4k_30fps.mp4', 'blender_rotacion_rotor_10s_4k_30fps.mp4', 'explicacion_blender_datos_escala.mp4'];
    for (const path of paths.filter(path => embeddedVideos.some(name => path.endsWith('/' + name)))) {
      checks.push(await probe(path, { method: 'GET', headers: { Range: 'bytes=0-511' }, validate: async response => {
        if (response.status !== 206) throw Error('El vídeo no admite reproducción por tramos');
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!bytes.includes(Buffer.from('ftyp')) || !bytes.includes(Buffer.from('moov'))) throw Error('Falta el índice de inicio rápido del vídeo');
      } }));
    }
  }
  const start = new Date(now.getTime() - 6 * 3600000);
  const esiosQuery = new URLSearchParams({ start_date: start.toISOString(), end_date: now.toISOString(), time_trunc: 'five_minutes' });
  const esios = await probe('/esios-api/indicators/551?' + esiosQuery, { method: 'GET', validate: async response => {
    const data = await response.json();
    if (Number(data.indicator?.id) !== 551) throw Error('Indicador ESIOS incorrecto');
    const dates = (data.indicator.values ?? []).filter(value => Number.isFinite(value.value)).map(value => Date.parse(value.datetime)).filter(Number.isFinite);
    const latest = Math.max(...dates);
    if (!Number.isFinite(latest) || now - latest > 90 * 60000 || latest - now > 15 * 60000) throw Error('ESIOS no contiene datos recientes');
    return { source: 'ESIOS', latest: new Date(latest).toISOString() };
  } });
  let dataCheck = esios;
  if (!esios.ok) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(part => [part.type, part.value]));
    const today = `${parts.year}-${parts.month}-${parts.day}`;
    const midnight = Date.parse(today + 'T00:00:00Z');
    const query = new URLSearchParams({ start_date: new Date(midnight - 7 * 86400000).toISOString().slice(0, 10) + 'T00:00', end_date: new Date(midnight - 86400000).toISOString().slice(0, 10) + 'T23:59', time_trunc: 'day', geo_trunc: 'electric_system', geo_limit: 'peninsular', geo_ids: '8741' });
    dataCheck = await probe('/ree-api/es/datos/generacion/estructura-generacion?' + query, { method: 'GET', validate: async response => {
      const data = await response.json();
      const wind = data.included?.find(item => item.attributes?.title?.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes('eolica'));
      const dates = (wind?.attributes?.values ?? []).filter(value => Number.isFinite(value.value) && value.datetime.slice(0, 10) < today).map(value => Date.parse(value.datetime)).filter(Number.isFinite);
      const latest = Math.max(...dates);
      if (!Number.isFinite(latest) || now - latest > 4 * 86400000) throw Error('El respaldo REData no contiene días cerrados recientes');
      return { source: 'REData', latest: new Date(latest).toISOString() };
    } });
    warnings.push(`ESIOS: ${esios.error}. Respaldo REData: ${dataCheck.ok ? 'operativo' : 'no disponible'}.`);
  }
  checks.push(dataCheck);
  checks.sort((a, b) => a.path.localeCompare(b.path));
  const failed = checks.filter(check => !check.ok);
  return { origin, checkedAt: now.toISOString(), ok: failed.length === 0, count: checks.length, failed, warnings, dataSource: dataCheck.source ?? null, checks };
}

export function summary(report) {
  return `# Vigilancia de AeroGenerador\n\n${report.ok ? '✅ Correcto' : '❌ Incidencia detectada'} · ${report.checkedAt}\n\n${report.count} comprobaciones. Fuente de datos: ${report.dataSource ?? 'no disponible'}.\n\n` +
    report.failed.map(check => `- **FALLO** ${check.path}: ${check.error}\n`).join('') +
    report.warnings.map(warning => `- Aviso: ${warning}\n`).join('') +
    '\nEsta comprobación detecta disponibilidad y recursos; no certifica render GPU, rendimiento móvil ni disponibilidad continua entre ejecuciones.\n';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await monitorSite();
  const destination = process.env.MONITOR_REPORT ?? 'monitor-report.json';
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, JSON.stringify(report, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary(report));
  console.log(JSON.stringify({ ok: report.ok, count: report.count, failed: report.failed, warnings: report.warnings, dataSource: report.dataSource }));
  process.exitCode = report.ok ? 0 : 1;
}
