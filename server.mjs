import { promises } from "node:dns";
import { createServer } from "node:http";
import { Router } from "./router.mjs";
import { customRequest } from "./customRequest.mjs";

const router = new Router();

// aqui eu defino minhas rotas com base na configuração do router

router.get("/", (req, res) => {
  res.end("Home");
});

router.get("/produto/notebook", (req, res) => {
  res.end("Produtos - Notebook");
});

router.post("/produto", (req, res) => {
  res.end("Notebook Post");
});

console.log(router.routes);

// isso aqui é um teste para chunks e buffers
// const frase1 = Promise.resolve("Olá");
// const frase2 = Promise.resolve("Mundo");
// const frasesPromisses = [frase1, frase2];
// const frases = [];

// for await (const frase of frasesPromisses) {
//   frases.push(frase);
// }

// const part1 = Buffer.from("Olá ");
// const part2 = Buffer.from("Mundo");
// const final = Buffer.concat([part1, part2]);

// console.log(final);
// console.log(final.toString("utf-8"));

// aqui começa o servidor
const server = createServer(async (request, response) => {
  const handler = router.find(req.method, req.pathname);
  if (handler) {
    handler(request, response);
  }

  const req = await customRequest(request);
});

server.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
