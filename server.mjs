import { promises } from "node:dns";
import { createServer } from "node:http";

const frase1 = Promise.resolve("Olá");
const frase2 = Promise.resolve("Mundo");
const frasesPromisses = [frase1, frase2];
const frases = [];

for await (const frase of frasesPromisses) {
  frases.push(frase);
}

const part1 = Buffer.from("Olá ");
const part2 = Buffer.from("Mundo");
const final = Buffer.concat([part1, part2]);

// console.log(final);
// console.log(final.toString("utf-8"));

const server = createServer(async (req, res) => {
  // res.setHeader("Content-Type", "text/plain");
  res.statusCode = 200;

  const url = new URL(req.url, "http://localhost");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "Authorization",
  );

  const cor = url.searchParams.get("cor");
  const tamanho = url.searchParams.get("tamanho");
  // console.log(req.headers["content-type"]);

  if (req.method === "GET" && url.pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
      <html>
        <head>
          <title>Mundo</title>
        </head>
        <body>
          <h1>Olá Mundo</h1>
        </body>
      </html>
      `);
  } else if (req.method === "POST" && url.pathname === "/produtos") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 201;
    // res.end(`Produto ${cor}, ${tamanho}`);
    res.end(JSON.stringify({ nome: "Notebook" }));
  } else {
    res.statusCode = 404;
    res.end("Página não encontrada");
  }
});

server.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
