/*
 * ============================================================================
 * CUSTOM REQUEST (ESTUDO)
 * ============================================================================
 *
 * Normaliza a requisição HTTP para facilitar acesso a query, pathname e body.
 */
export async function customRequest(req) {
  const url = new URL(req.url, "http://localhost");
  req.query = url.searchParams;
  req.pathname = url.pathname;
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString("utf-8");
  if (req.headers["content-type"] === "application/json") {
    req.body = body ? JSON.parse(body) : null;
  } else {
    req.body = body;
  }

  return req;
}
