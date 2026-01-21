import type { CustomRequest } from "./http/customRequest.ts";
import type { CustomResponse } from "./http/customResponse.ts";

export type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

export type Middleware = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

type Routes = {
  [method: string]: {
    [path: string]: {
      handler: Handler;
      middlewares: Middleware[];
    };
  };
};

export class Router {
  routes: Routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    HEAD: {},
  };
  middlewares: Middleware[] = [];

  get(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["GET"][route] = { handler, middlewares };
  }

  post(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["POST"][route] = { handler, middlewares };
  }

  put(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["PUT"][route] = { handler, middlewares };
  }

  delete(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["DELETE"][route] = { handler, middlewares };
  }

  head(route: string, handler: Handler, middlewares: Middleware[] = []) {
    this.routes["HEAD"][route] = { handler, middlewares };
  }

  use(middlewares: Middleware[]) {
    this.middlewares.push(...middlewares);
  }

  find(method: string, pathname: string) {
    const routesByMethod = this.routes[method];
    if (!routesByMethod) return null;

    const matchedRoute = routesByMethod[pathname];
    if (matchedRoute) return { route: matchedRoute, params: {} };

    const reqParts = pathname.split("/").filter(Boolean);

    for (const route of Object.keys(routesByMethod)) {
      if (!route.includes(":")) continue;

      const routeParts = route.split("/").filter(Boolean);

      if (reqParts.length !== routeParts.length) continue;
      if (reqParts[0] !== routeParts[0]) continue;

      const params: Record<string, string> = {};
      let ok = true;

      for (let i = 0; i < reqParts.length; i++) {
        const segment = routeParts[i];
        const value = reqParts[i];

        if (segment.startsWith(":")) {
          params[segment.slice(1)] = value;
        } else if (segment !== value) {
          ok = false;
          break;
        }
      }

      if (ok) {
        return { route: routesByMethod[route], params };
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
 * CLASSE Router - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * Ela guarda todas as rotas que você registra e ajuda a encontrar qual rota
 * deve ser executada quando alguém faz uma requisição
 *
 * routes - É onde ficam guardadas todas as rotas
 * Formato: { GET: { "/": { handler: função1, middlewares: [] }, ... }, POST: { ... } }
 * Cada rota guarda o handler (função) e os middlewares específicos dessa rota
 *
 * middlewares - Array de middlewares globais que rodam em TODAS as rotas
 * Esses middlewares são executados antes dos middlewares específicos de cada rota
 *
 * ----------------------------------------------------------------------------
 * MÉTODO get(route, handler, middlewares) - Registrar rota GET
 * ----------------------------------------------------------------------------
 * Você usa isso para dizer: "Quando alguém fizer GET nessa URL, rode essa função"
 *
 * Parâmetros:
 *   - route: string - Caminho da rota (ex: "/curso/:curso")
 *   - handler: Handler - Função que será executada
 *   - middlewares: Middleware[] - Array de middlewares específicos dessa rota (opcional)
 *
 * Exemplo:
 *   router.get("/curso/:curso", (req, res) => {
 *     res.json({ message: "Olá!" })
 *   }, [logger]) // logger vai rodar só nessa rota
 *
 * Agora quando alguém acessar GET /curso/javascript, essa função roda
 *
 * ----------------------------------------------------------------------------
 * MÉTODO post(route, handler, middlewares) - Registrar rota POST
 * ----------------------------------------------------------------------------
 * Mesma coisa do get, mas para requisições POST
 * Usa quando você quer receber dados (como criar algo novo)
 *
 * Exemplo:
 *   router.post("/curso", (req, res) => {
 *     const dados = req.body;
 *     res.json({ message: "Curso criado!" })
 *   }, [logger]) // middlewares opcionais
 *
 * ----------------------------------------------------------------------------
 * MÉTODO put(route, handler, middlewares) - Registrar rota PUT
 * ----------------------------------------------------------------------------
 * Mesma coisa do get/post, mas para requisições PUT
 * Usa quando você quer atualizar algo que já existe
 *
 * Exemplo:
 *   router.put("/curso/:slug", (req, res) => {
 *     const slug = req.params.slug;
 *     res.json({ message: "Curso atualizado!" })
 *   }, [logger])
 *
 * ----------------------------------------------------------------------------
 * MÉTODO delete(route, handler, middlewares) - Registrar rota DELETE
 * ----------------------------------------------------------------------------
 * Mesma coisa dos outros, mas para requisições DELETE
 * Usa quando você quer deletar algo
 *
 * Exemplo:
 *   router.delete("/curso/:slug", (req, res) => {
 *     res.json({ message: "Curso deletado!" })
 *   }, [logger])
 *
 * ----------------------------------------------------------------------------
 * MÉTODO head(route, handler, middlewares) - Registrar rota HEAD
 * ----------------------------------------------------------------------------
 * Mesma coisa dos outros, mas para requisições HEAD
 * HEAD é tipo GET, mas só retorna os headers (sem o corpo da resposta)
 * Usa quando você só quer saber se algo existe, sem pegar os dados
 *
 * Exemplo:
 *   router.head("/curso/:slug", (req, res) => {
 *     res.status(200).end()
 *   }, [logger])
 *
 * ----------------------------------------------------------------------------
 * MÉTODO use(middlewares) - Registrar middlewares globais
 * ----------------------------------------------------------------------------
 * Adiciona middlewares que vão rodar em TODAS as rotas
 * Esses middlewares rodam ANTES dos middlewares específicos de cada rota
 *
 * Exemplo:
 *   router.use([logger, outroMiddleware])
 *   
 * Agora logger e outroMiddleware vão rodar em TODAS as rotas
 * Ordem de execução:
 *   1. Middlewares globais (do use)
 *   2. Middlewares da rota
 *   3. Handler da rota
 *
 * ----------------------------------------------------------------------------
 * MÉTODO find(method, pathname) - Encontrar a rota certa
 * ----------------------------------------------------------------------------
 * Esse é o método mais importante! Ele procura qual rota deve ser executada
 *
 * Retorna: { route: { handler, middlewares }, params: { ... } } ou null
 * O objeto "route" contém o handler e os middlewares da rota encontrada
 *
 * Como funciona:
 *   1. Primeiro tenta achar uma rota exata (sem parâmetros)
 *      Exemplo: Se alguém acessa "/", procura rota "/"
 *      Se achar, retorna: { route: { handler, middlewares }, params: {} }
 *
 *   2. Se não achar, procura rotas com parâmetros dinâmicos (que têm ":")
 *      Exemplo: Se alguém acessa "/curso/javascript", procura rota "/curso/:curso"
 *
 *   3. Quando acha uma rota com ":", ele:
 *      - Compara cada pedaço da URL com cada pedaço da rota
 *      - Se o pedaço da rota começa com ":", é um parâmetro (pega o valor)
 *      - Se não começa com ":", tem que ser igual
 *
 *   4. Se tudo bater, retorna o objeto completo da rota e os parâmetros
 *      Se não achar nada, retorna null (rota não existe)
 *
 * Exemplo prático:
 *   Rota registrada: "/curso/:curso/pegar" com middlewares [logger]
 *   Alguém acessa: GET /curso/javascript/pegar
 *
 *   O que acontece:
 *   - Divide em pedaços: ["curso", "javascript", "pegar"]
 *   - Compara com rota: ["curso", ":curso", "pegar"]
 *   - "curso" = "curso" ✓
 *   - ":curso" é parâmetro, então pega "javascript" ✓
 *   - "pegar" = "pegar" ✓
 *   - Retorna: { route: { handler: função, middlewares: [logger] }, params: { curso: "javascript" } }
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * Router = guarda rotas e ajuda a encontrar qual executar
 * middlewares = array de middlewares globais (rodam em todas as rotas)
 * get() = registra rota GET (buscar/ler dados) - aceita middlewares como 3º parâmetro
 * post() = registra rota POST (criar algo novo) - aceita middlewares como 3º parâmetro
 * put() = registra rota PUT (atualizar algo existente) - aceita middlewares como 3º parâmetro
 * delete() = registra rota DELETE (deletar algo) - aceita middlewares como 3º parâmetro
 * head() = registra rota HEAD (verificar se existe, sem pegar dados) - aceita middlewares como 3º parâmetro
 * use() = adiciona middlewares globais (rodam em todas as rotas)
 * find() = procura qual rota executar quando alguém faz uma requisição
 *          Retorna { route: { handler, middlewares }, params: { ... } }
 */
