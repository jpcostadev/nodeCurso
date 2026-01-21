import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
  type Server,
} from "node:http";
import { Router } from "./router.ts";
import { customRequest } from "./http/customRequest.ts";
import { customResponse } from "./http/customResponse.ts";
import { bodyJson } from "./middleware/bodyJson.ts";
import { RouteError } from "./utils/routeError.ts";
import { Database } from "./database.ts";

export class Core {
  router: Router;
  server: Server;
  db: Database;
  constructor() {
    this.router = new Router();
    this.router.use([bodyJson]);
    this.server = createServer(this.handler);
    this.db = new Database("./lms.sqlite");
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const req = await customRequest(request);
      const res = customResponse(response);

      for (const middleware of this.router.middlewares) {
        await middleware(req, res);
      }

      const matched = this.router.find(req.method || "", req.pathname);
      if (!matched) {
        throw new RouteError(404, "Não Encontrada");
      }

      const { route, params } = matched;
      req.params = params;

      for (const middleware of route.middlewares) {
        await middleware(req, res);
      }

      await route.handler(req, res);
    } catch (error) {
      if (error instanceof RouteError) {
        console.error(
          `${error.status} ${error.message} | ${request.method} ${request.url}`,
        );
        response.statusCode = error.status;
        response.setHeader("content-type", "application/problem+json");
        response.end(
          JSON.stringify({ status: response.statusCode, title: error.message }),
        );
      } else {
        console.error(error);
        response.statusCode = 500;
        response.setHeader("content-type", "application/problem+json");
        response.end(
          JSON.stringify({ status: response.statusCode, title: "Error" }),
        );
      }
    }
  };

  init() {
    this.server.listen(3000, () => {
      console.log("Server: http://localhost:3000");
    });
  }
}

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse é o arquivo mais importante! É o "coração" da API
 * Ele cria o servidor HTTP e faz tudo funcionar junto
 *
 * ----------------------------------------------------------------------------
 * CLASSE Core - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * Ela junta tudo: cria o servidor, gerencia as rotas e processa requisições
 * É tipo o "chefe" que coordena tudo
 *
 * router - Guarda e gerencia todas as rotas (GET, POST, etc)
 * server - O servidor HTTP do Node.js que escuta requisições
 *
 * ----------------------------------------------------------------------------
 * CONSTRUTOR - O QUE ACONTECE QUANDO CRIA?
 * ----------------------------------------------------------------------------
 * Quando você faz: const core = new Core()
 *
 * Ele:
 *   1. Cria um router novo (pra guardar as rotas)
 *   2. Cria o servidor HTTP
 *   3. Liga o método handler() pra processar TODAS as requisições
 *
 * ----------------------------------------------------------------------------
 * MÉTODO handler() - O QUE ELE FAZ?
 * ----------------------------------------------------------------------------
 * Esse método roda SEMPRE que alguém faz uma requisição pro servidor
 * É tipo um "porteiro" que recebe a requisição e decide o que fazer
 *
 * Passo a passo do que acontece:
 *   1. Transforma a requisição em CustomRequest
 *      Agora você tem req.query, req.pathname, req.body, etc. prontos
 *
 *   2. Transforma a resposta em CustomResponse
 *      Agora você pode usar res.status() e res.json()
 *
 *   3. Executa os middlewares globais primeiro
 *      Esses middlewares rodam em TODAS as requisições, mesmo se a rota não existir
 *
 *   4. Procura qual rota deve ser executada
 *      Usa router.find() pra achar a função certa
 *      Se não achar, retorna 404 e para por aqui
 *
 *   5. Se achou a rota:
 *      - Extrai route e params do resultado: const { route, params } = matched
 *      - Coloca os parâmetros da URL em req.params
 *        Exemplo: Rota "/curso/:curso" com URL "/curso/javascript"
 *        -> req.params = { curso: "javascript" }
 *      - Executa os middlewares específicos da rota (route.middlewares)
 *      - Por último executa o handler da rota (route.handler)
 *
 * ----------------------------------------------------------------------------
 * MÉTODO init() - INICIAR O SERVIDOR
 * ----------------------------------------------------------------------------
 * Faz o servidor começar a "escutar" na porta 3000
 *
 * IMPORTANTE: Chame isso DEPOIS de registrar todas as rotas!
 *
 * Quando o servidor estiver pronto, mostra no console:
 *   "Server: http://localhost:3000"
 *
 * ----------------------------------------------------------------------------
 * COMO USAR (FLUXO COMPLETO)
 * ----------------------------------------------------------------------------
 * 1. Criar o core:
 *    const core = new Core()
 *
 * 2. Registrar middlewares globais (opcional):
 *    core.router.use([logger]) // roda em todas as rotas
 *
 * 3. Registrar rotas:
 *    core.router.get("/", (req, res) => { ... })
 *    core.router.get("/curso/:slug", (req, res) => { ... }, [middleware1]) // middlewares específicos
 *
 * 4. Iniciar servidor:
 *    core.init()
 *
 * 4. Pronto! Servidor rodando na porta 3000
 *    Quando alguém acessar uma URL, o handler() processa e executa a rota certa
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * Core = cria servidor e coordena tudo
 * handler() = processa cada requisição, executa middlewares e acha a rota certa
 * init() = inicia o servidor na porta 3000
 * Use assim: criar -> middlewares globais (opcional) -> registrar rotas -> iniciar
 * Ordem de execução:
 *   1. Middlewares globais (sempre rodam, mesmo se rota não existir)
 *   2. Procura a rota (router.find)
 *   3. Se não encontrou, retorna 404
 *   4. Se encontrou: middlewares da rota -> handler da rota
 */
