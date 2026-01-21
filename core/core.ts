import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
  type Server,
} from "node:http";
import { Router } from "./router.ts";
import { customRequest } from "../api/http/customRequest.ts";
import { customResponse } from "../api/http/customResponse.ts";

export class Core {
  router: Router;
  server: Server;

  constructor() {
    this.router = new Router();
    this.server = createServer(this.handler);
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    const req = await customRequest(request);
    const res = customResponse(response);
    
    const routeMatch = this.router.find(req.method || "", req.pathname);

    if (routeMatch) {
      req.params = routeMatch.params;
      routeMatch.handler(req, res);
    } else {
      res.status(404);
      res.end("Rota não encontrada");
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
 *   3. Procura qual rota deve ser executada
 *      Usa router.find() pra achar a função certa
 *      Se achar, retorna { handler: função, params: { ... } }
 *      Se não achar, retorna null
 *
 *   4. Se achou a rota:
 *      - Coloca os parâmetros da URL em req.params
 *        Exemplo: Rota "/curso/:curso" com URL "/curso/javascript"
 *        -> req.params = { curso: "javascript" }
 *      - Chama a função da rota passando req e res
 *
 *   5. Se não achou a rota:
 *      - Retorna 404 (não encontrado)
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
 * 2. Registrar rotas:
 *    core.router.get("/", (req, res) => { ... })
 *    core.router.get("/curso/:slug", (req, res) => { ... })
 *
 * 3. Iniciar servidor:
 *    core.init()
 *
 * 4. Pronto! Servidor rodando na porta 3000
 *    Quando alguém acessar uma URL, o handler() processa e executa a rota certa
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * Core = cria servidor e coordena tudo
 * handler() = processa cada requisição e acha a rota certa
 * init() = inicia o servidor na porta 3000
 * Use assim: criar -> registrar rotas -> iniciar
 */
