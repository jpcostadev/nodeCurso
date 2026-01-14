export async function customRequest(req) {
  const url = new URL(req.url, "http://localhost");
  req.query = url.searchParams;
  req.pathname = url.pathname;
  const chunks = [];

  for await (const chunk of req) {
    chunk.push();
  }

  const body = Buffer.contat(chunks).toString("utf-8");
  if (req.headers["content-type"] === "application/json") {
    req.body = JSON.parse(req.body);
  } else {
    req.body = body;
  }

  return req;
}
