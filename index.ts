import { Core } from "./core/core.ts";
import { pegarCurso } from "./core/database.ts";

const core = new Core();

core.router.get("/curso/:slug", (req, res) => {
  const { slug } = req.params;
  const curso = pegarCurso(slug);
  if (curso) {
    res.status(200).json(curso);
  } else {
    res.status(404).json("Curso não encontrado");
  }
});

core.router.get("/curso/:curso/deletar", (req, res) => {
  const slug = req.params.curso;
  const curso = pegarCurso(slug);

  if (curso) {
    res.status(200).json(curso);
  } else {
    res.status(404).json("curso não encontrado");
  }
});

core.router.get("/aula/:aula", (req, res) => {
  res.status(200).end("aula");
});

core.router.get("/", (req, res) => {
  res.status(200).end("hello");
});

core.init();

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse é o arquivo principal! É por aqui que tudo começa
 * Aqui você configura o servidor e registra todas as rotas da sua API
 *
 * ----------------------------------------------------------------------------
 * COMO FUNCIONA (PASSO A PASSO)
 * ----------------------------------------------------------------------------
 * 1. Cria o servidor:
 *    const core = new Core()
 *    (Isso cria o servidor HTTP e o sistema de rotas)
 *
 * 2. Registra as rotas:
 *    core.router.get("/", ...)  <- rota GET
 *    core.router.post("/", ...) <- rota POST
 *    (Aqui você diz: "quando acessarem essa URL, faça isso")
 *
 * 3. Inicia o servidor:
 *    core.init()
 *    (Agora o servidor começa a escutar na porta 3000)
 *
 * ----------------------------------------------------------------------------
 * ROTAS QUE ESTÃO REGISTRADAS
 * ----------------------------------------------------------------------------
 *
 * GET /curso/:slug
 *   Busca um curso pelo slug
 *   Exemplo: GET /curso/javascript
 *   - req.params.slug vai ter "javascript"
 *   - Busca o curso no banco
 *   - Retorna 200 com os dados se encontrar
 *   - Retorna 404 se não encontrar
 *
 * GET /curso/:curso/deletar
 *   (Rota de exemplo com parâmetro dinâmico)
 *   Exemplo: GET /curso/javascript/deletar
 *   - req.params.curso vai ter "javascript"
 *
 * GET /aula/:aula
 *   (Rota de exemplo)
 *   Exemplo: GET /aula/javascript
 *   - req.params.aula vai ter "javascript"
 *   - Retorna "aula"
 *
 * GET /
 *   Rota raiz (página inicial)
 *   Exemplo: GET /
 *   - Retorna "hello"
 *
 * ----------------------------------------------------------------------------
 * O QUE SÃO PARÂMETROS DINÂMICOS?
 * ----------------------------------------------------------------------------
 * Quando você coloca ":" na rota, aquela parte vira um parâmetro
 *
 * Exemplo:
 *   Rota: "/curso/:slug"
 *   URL acessada: "/curso/javascript"
 *   
 *   O que acontece:
 *   - O router vê que ":slug" é um parâmetro
 *   - Pega o valor "javascript" da URL
 *   - Coloca em req.params.slug = "javascript"
 *   - Agora você pode usar req.params.slug na sua função
 *
 * Outro exemplo:
 *   Rota: "/curso/:curso/aula/:aula"
 *   URL: "/curso/javascript/aula/1"
 *   req.params = { curso: "javascript", aula: "1" }
 *
 * ----------------------------------------------------------------------------
 * DICAS IMPORTANTES
 * ----------------------------------------------------------------------------
 * - Sempre chame core.init() DEPOIS de registrar todas as rotas
 * - O servidor roda na porta 3000
 * - Acesse em: http://localhost:3000
 * - Para testar, use o arquivo client.mjs ou um programa como Postman
 *
 * ----------------------------------------------------------------------------
 * RESUMO
 * ----------------------------------------------------------------------------
 * Esse arquivo: cria servidor -> registra rotas -> inicia servidor
 * Rotas com ":" têm parâmetros dinâmicos (ex: /curso/:slug)
 * Parâmetros ficam em req.params (ex: req.params.slug)
 */
