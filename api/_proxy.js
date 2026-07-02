const DEFAULT_CACHE_SECONDS = 60;

function appendQueryParams(searchParams, query = {}) {
  Object.entries(query).forEach(([key, value]) => {
    if (key === 'path' || typeof value === 'undefined') return;
    if (Array.isArray(value)) {
      value.forEach((entry) => searchParams.append(key, entry));
      return;
    }
    searchParams.append(key, value);
  });
}

function buildTargetUrl(req, baseUrl) {
  const rawPathParts = Array.isArray(req.query.path)
    ? req.query.path
    : typeof req.query.path === 'string'
      ? [req.query.path]
      : [];
  const pathParts = rawPathParts.flatMap((part) => String(part).split('/')).filter(Boolean);
  const safePath = pathParts.map((part) => encodeURIComponent(part)).join('/');
  const targetUrl = new URL(safePath ? `${baseUrl}/${safePath}` : baseUrl);
  appendQueryParams(targetUrl.searchParams, req.query);
  return targetUrl;
}

function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
}

export async function proxyGet(req, res, { baseUrl, headers = {}, cacheSeconds = DEFAULT_CACHE_SECONDS }) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (!['GET', 'HEAD'].includes(req.method)) {
    res.status(405).json({ error: 'Metodo no permitido' });
    return;
  }

  try {
    const targetUrl = buildTargetUrl(req, baseUrl);
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
    });
    const contentType = response.headers.get('content-type') ?? 'application/json; charset=utf-8';
    const body = Buffer.from(await response.arrayBuffer());

    res.status(response.status);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', `s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 5}`);
    res.send(body);
  } catch (error) {
    res.status(502).json({
      error: 'No se pudo consultar el servicio externo.',
      detail: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
}
