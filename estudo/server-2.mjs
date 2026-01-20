import { promises } from "node:dns";
import { createServer } from "node:http";
import { Router } from "./router.mjs";
import { customRequest } from "./customRequest.mjs";
import { customResponse } from "./customResponse.mjs";
import fs from "node:fs/promises";

const router = new Router();

// aqui eu defino minhas rotas com base na configuração do router

//-----------------------------------------
// Rota para criar um produto
//-----------------------------------------
router.post("/produtos", async (req, res) => {
  const { categoria, slug } = req.body;
  try {
    await fs.mkdir(`./produtos/${categoria}`, { recursive: true }); // recursive true se precisar de pasta dentro de pasta
  } catch {
    console.log(`${categoria} já criada`);
  }

  try {
    await fs.writeFile(
      `./produtos/${categoria}/${slug}.json`,
      JSON.stringify(req.body),
      res.status(201).json(`${slug} registrado com sucesso!`),
    );
  } catch {
    res.status(500).res.end(`Erro ao criar ${slug}`);
  }
});

//-----------------------------------------
// Rota de listar todos os produtos
//-----------------------------------------
router.get("/produtos", async (req, res) => {
  try {
    const listaArquivos = await fs.readdir("./produtos", { recursive: true });
    const arquivosJson = listaArquivos.filter((item) => item.endsWith(".json"));
    const promises = [];
    for (const arquivo of arquivosJson) {
      const conteudo = fs.readFile(`./produtos/${arquivo}`, "utf-8");
      promises.push(conteudo);
    }
    const conteudos = await Promise.all(promises);
    const produtos = conteudos.map(JSON.parse);
    res.status(200).json(produtos);
    console.log(produtos);
  } catch {
    res.status(500).end("Erro ao listar produtos");
  }
});

//-----------------------------------------
// Rota de listar um produto
//-----------------------------------------
router.get("/produto", async (req, res) => {
  const categoria = req.query.get("categoria");
  const slug = req.query.get("slug");

  try {
    const conteudo = await fs.readFile(
      `./produtos/${categoria}/${slug}.json`,
      "utf-8",
    );
    const produto = JSON.parse(conteudo);
    res.status(201).json(produto);
  } catch {
    res.status(404).json("Erro ao buscar o produto");
  }
});

// aqui começa o servidor
const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = customResponse(response);
  const handler = router.find(req.method, req.pathname);

  if (handler) {
    handler(request, res);
  } else {
    res.status(404);
    res.end("Não encontrada");
  }
});

server.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});

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
