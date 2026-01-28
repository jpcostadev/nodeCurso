/*
 * ============================================================================
 * SERVIDOR DE ESTUDO (SQLite)
 * ============================================================================
 *
 * Exemplo simples de API com SQLite e rotas manuais.
 */
import { promises } from "node:dns";
import { createServer } from "node:http";
import { Router } from "./router.mjs";
import { customRequest } from "./customRequest.mjs";
import { customResponse } from "./customResponse.mjs";
import {
  criarCurso,
  criarAula,
  pegarCursos,
  pegarCurso,
  pegarAulas,
  pegarAula,
} from "./database.mjs";

const router = new Router();

// aqui eu defino minhas rotas com base na configuração do router
router.post("/cursos", (req, res) => {
  const criado = criarCurso(req.body);
  if (criado) {
    res.status(201).json("Curso criado!");
  } else {
    res.status(400).json("Erro ao criar");
  }
});

router.post("/aulas", (req, res) => {
  const { slug, nome, cursoSlug } = req.body;
  const criada = criarAula({ slug, nome, cursoSlug });
  if (criada) {
    res.status(201).json("Aula criada!");
  } else {
    res.status(400).json("Erro ao criar aula.");
  }
});

router.get("/cursos", (req, res) => {
  const cursos = pegarCursos();
  if (cursos && cursos.length) {
    res.status(200).json(cursos);
  } else {
    res.status(404).json("Erro ao buscar cursos");
  }
});

router.get("/curso", (req, res) => {
  const slug = req.query.get("slug");
  const curso = pegarCurso(slug);
  if (curso) {
    res.status(200).json(curso);
  } else {
    res.status(404).json("curso não encontrado.");
  }
});

router.get("/aulas", (req, res) => {
  const curso = req.query.get("curso");
  const aulas = pegarAulas(curso);
  if (aulas && aulas.length) {
    res.status(200).json(aulas);
  } else {
    res.status(404).json("curso não encontrado.");
  }
});

router.get("/aula", (req, res) => {
  const curso = req.query.get("curso");
  const slug = req.query.get("slug");
  const aula = pegarAula(curso, slug);
  if (aula) {
    res.status(200).json(aula);
  } else {
    res.status(404).json("Aula não encontrada.");
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
