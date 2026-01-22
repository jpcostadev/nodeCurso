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
        throw new RouteError(404, "Rota não Encontrada");
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
 * Ela junta tudo: cria o servidor, gerencia as rotas, banco de dados e processa requisições
 * É tipo o "chefe" que coordena tudo - é o coração do framework
 *
 * PROPRIEDADES:
 * router - Instância do Router (gerencia todas as rotas)
 * server - Servidor HTTP do Node.js (escuta requisições na porta 3000)
 * db - Instância do Database (banco SQLite com cache de queries)
 *
 * ----------------------------------------------------------------------------
 * CONSTRUTOR - O QUE ACONTECE QUANDO CRIA?
 * ----------------------------------------------------------------------------
 * Quando você faz: const core = new Core()
 *
 * Ele:
 *   1. Cria um router novo (pra guardar as rotas)
 *   2. Registra bodyJson como middleware global automaticamente
 *      (pra todas as rotas já terem acesso ao req.body parseado)
 *   3. Cria o servidor HTTP
 *   4. Cria a conexão com o banco SQLite (./lms.sqlite)
 *   5. Liga o método handler() pra processar TODAS as requisições
 *
 * ----------------------------------------------------------------------------
 * MÉTODO handler() - O QUE ELE FAZ?
 * ----------------------------------------------------------------------------
 * Esse método roda SEMPRE que alguém faz uma requisição pro servidor
 * É tipo um "porteiro" que recebe a requisição e decide o que fazer
 *
 * Passo a passo do que acontece (tudo dentro de try/catch):
 *   1. Transforma a requisição em CustomRequest
 *      Agora você tem req.query, req.pathname, req.body, req.params prontos
 *
 *   2. Transforma a resposta em CustomResponse
 *      Agora você pode usar res.status() e res.json()
 *
 *   3. Executa os middlewares globais primeiro
 *      Esses middlewares rodam em TODAS as requisições, mesmo se a rota não existir
 *      Exemplo: bodyJson (já registrado) e logger (se você registrar)
 *
 *   4. Procura qual rota deve ser executada
 *      Usa router.find() pra achar a função certa
 *      Se não achar, lança RouteError(404, "Não Encontrada")
 *
 *   5. Se achou a rota:
 *      - Extrai route e params: const { route, params } = matched
 *      - Coloca os parâmetros da URL em req.params
 *        Exemplo: Rota "/products/:slug" com URL "/products/notebook"
 *        -> req.params = { slug: "notebook" }
 *      - Executa os middlewares específicos da rota (route.middlewares)
 *      - Por último executa o handler da rota (route.handler)
 *
 *   6. Se der erro:
 *      - Se for RouteError: retorna JSON com status e mensagem
 *        Formato: { status: 404, title: "Não Encontrada" }
 *        Content-Type: application/problem+json
 *      - Se for outro erro: retorna 500 (erro interno)
 *      - Todos os erros são logados no console
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
 *    (Já cria servidor, router, database e registra bodyJson)
 *
 * 2. Registrar middlewares globais adicionais (opcional):
 *    core.router.use([logger]) // além do bodyJson que já vem
 *
 * 3. Criar e inicializar APIs:
 *    new ProductApi(core).init()
 *    (Isso cria tabelas e registra rotas da API)
 *
 * 4. Iniciar servidor:
 *    core.init()
 *
 * 5. Pronto! Servidor rodando na porta 3000
 *    Quando alguém acessar uma URL, o handler() processa tudo
 *
 * ----------------------------------------------------------------------------
 * ACESSO AO BANCO DE DADOS
 * ----------------------------------------------------------------------------
 * O Core já cria o database automaticamente
 * Acesse via: core.db
 *
 * Exemplos:
 *   - core.db.exec(sql) - Executa SQL direto
 *   - core.db.query(sql).get(param) - Query preparada com cache
 *   - core.db.prepare(sql).get(param) - Query preparada sem cache
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * Core = servidor + router + database (tudo junto)
 * handler() = processa requisições com try/catch e trata erros
 * init() = inicia servidor na porta 3000
 * bodyJson = middleware global já registrado automaticamente
 * RouteError = use pra lançar erros HTTP customizados
 * Ordem de execução:
 *   1. Middlewares globais (bodyJson + outros que você registrar)
 *   2. Procura a rota (router.find)
 *   3. Se não encontrou, lança RouteError(404)
 *   4. Se encontrou: middlewares da rota -> handler da rota
 *   5. Se der erro: captura e retorna JSON de erro
 */
