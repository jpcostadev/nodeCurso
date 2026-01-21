import type { CustomRequest } from "../api/http/customRequest.ts";
import type { CustomResponse } from "../api/http/customResponse.ts";

// Tipo Handler
type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

// Tipo RouteMatch
type RouteMatch = {
  handler: Handler;
  params: Record<string, string>;
};

export class Router {
  routes: Record<string, Record<string, Handler>> = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    HEAD: {},
  };

  // Método get
  get(route: string, handler: Handler) {
    this.routes["GET"][route] = handler;
  }

  // Método post
  post(route: string, handler: Handler) {
    this.routes["POST"][route] = handler;
  }
  // Método put
  put(route: string, handler: Handler) {
    this.routes["PUT"][route] = handler;
  }
  // Método Delete
  delete(route: string, handler: Handler) {
    this.routes["DELETE"][route] = handler;
  }
  // Método Head
  head(route: string, handler: Handler) {
    this.routes["HEAD"][route] = handler;
  }

  // Método find
  find(method: string, pathname: string): RouteMatch | null {
    const routesByMethod = this.routes[method];
    if (!routesByMethod) return null;

    const matchedRoute = routesByMethod[pathname];
    if (matchedRoute) {
      return { handler: matchedRoute, params: {} };
    }

    const reqParts = pathname.split("/").filter(Boolean);

    for (const route of Object.keys(routesByMethod)) {
      if (!route.includes(":")) continue;

      const routeParts = route.split("/").filter(Boolean);

      if (reqParts.length !== routeParts.length) continue;
      if (reqParts[0] !== routeParts[0]) continue;

      const params: Record<string, string> = {};
      let isMatch = true;

      for (let i = 0; i < reqParts.length; i++) {
        const routeSegment = routeParts[i];
        const reqValue = reqParts[i];

        if (routeSegment.startsWith(":")) {
          const paramName = routeSegment.slice(1);
          params[paramName] = reqValue;
        } else if (routeSegment !== reqValue) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        const handler = routesByMethod[route];
        return { handler, params };
      }
    }

    return null;
  }
}

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo cria um sistema de rotas para a API. É tipo um "guia" que diz:
 * "Quando alguém acessar essa URL, execute essa função aqui"
 *
 * ----------------------------------------------------------------------------
 * O QUE É UM Handler?
 * ----------------------------------------------------------------------------
 * Handler é só um nome chique para "função que vai rodar quando a rota for chamada"
 * Ela recebe a requisição (req) e a resposta (res) e faz o que precisa fazer
 * Pode ser uma função normal ou async (assíncrona)
 *
 * ----------------------------------------------------------------------------
 * O QUE É RouteMatch?
 * ----------------------------------------------------------------------------
 * Quando o router encontra uma rota que bate com a URL, ele retorna isso:
 * { handler: a função que vai rodar, params: os parâmetros da URL }
 * 
 * Exemplo: Se a rota é "/curso/:curso" e alguém acessa "/curso/javascript"
 * Ele retorna: { handler: função, params: { curso: "javascript" } }
 *
 * ----------------------------------------------------------------------------
 * CLASSE Router - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * Ela guarda todas as rotas que você registra e ajuda a encontrar qual rota
 * deve ser executada quando alguém faz uma requisição
 *
 * routes - É onde ficam guardadas todas as rotas
 * Formato: { GET: { "/": função1, "/curso/:curso": função2 }, POST: { ... } }
 * Basicamente: "Para GET, essas são as rotas. Para POST, essas outras..."
 *
 * ----------------------------------------------------------------------------
 * MÉTODO get(route, handler) - Registrar rota GET
 * ----------------------------------------------------------------------------
 * Você usa isso para dizer: "Quando alguém fizer GET nessa URL, rode essa função"
 * 
 * Exemplo:
 *   router.get("/curso/:curso", (req, res) => {
 *     res.json({ message: "Olá!" })
 *   })
 * 
 * Agora quando alguém acessar GET /curso/javascript, essa função roda
 *
 * ----------------------------------------------------------------------------
 * MÉTODO post(route, handler) - Registrar rota POST
 * ----------------------------------------------------------------------------
 * Mesma coisa do get, mas para requisições POST
 * Usa quando você quer receber dados (como criar algo novo)
 *
 * ----------------------------------------------------------------------------
 * MÉTODO find(method, pathname) - Encontrar a rota certa
 * ----------------------------------------------------------------------------
 * Esse é o método mais importante! Ele procura qual rota deve ser executada
 *
 * Como funciona:
 *   1. Primeiro tenta achar uma rota exata (sem parâmetros)
 *      Exemplo: Se alguém acessa "/", procura rota "/"
 *
 *   2. Se não achar, procura rotas com parâmetros dinâmicos (que têm ":")
 *      Exemplo: Se alguém acessa "/curso/javascript", procura rota "/curso/:curso"
 *
 *   3. Quando acha uma rota com ":", ele:
 *      - Compara cada pedaço da URL com cada pedaço da rota
 *      - Se o pedaço da rota começa com ":", é um parâmetro (pega o valor)
 *      - Se não começa com ":", tem que ser igual
 *
 *   4. Se tudo bater, retorna a função e os parâmetros
 *      Se não achar nada, retorna null (rota não existe)
 *
 * Exemplo prático:
 *   Rota registrada: "/curso/:curso/pegar"
 *   Alguém acessa: GET /curso/javascript/pegar
 *   
 *   O que acontece:
 *   - Divide em pedaços: ["curso", "javascript", "pegar"]
 *   - Compara com rota: ["curso", ":curso", "pegar"]
 *   - "curso" = "curso" ✓
 *   - ":curso" é parâmetro, então pega "javascript" ✓
 *   - "pegar" = "pegar" ✓
 *   - Retorna: { handler: função, params: { curso: "javascript" } }
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * Router = guarda rotas e ajuda a encontrar qual executar
 * get/post = registra uma rota
 * find = procura qual rota executar quando alguém faz uma requisição
 */
