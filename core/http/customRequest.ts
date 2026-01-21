import type { IncomingMessage } from "node:http";

// Interface CustomRequest
export interface CustomRequest extends IncomingMessage {
  query: URLSearchParams;
  pathname: string;
  body: Record<string, any>;
  params: Record<string, any>;
}

// Função customRequest
export async function customRequest(request: IncomingMessage) {
  const req = request as CustomRequest;

  const url = new URL(req.url || "", "http://localhost");
  req.query = url.searchParams;
  req.pathname = url.pathname;
  req.params = {};
  req.body = {};

  return req;
}

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo pega a requisição HTTP que vem do Node.js (que é meio complicada)
 * e transforma numa coisa mais fácil de usar, com tudo que você precisa já pronto
 *
 * ----------------------------------------------------------------------------
 * INTERFACE CustomRequest - O QUE TEM DENTRO?
 * ----------------------------------------------------------------------------
 * É tipo um "objeto requisição melhorado" que tem:
 *
 * query - Os parâmetros que vêm depois do "?" na URL
 *   Exemplo: /curso?slug=javascript -> query tem { slug: "javascript" }
 *
 * pathname - Só o caminho da URL, sem os parâmetros
 *   Exemplo: /curso?slug=javascript -> pathname é "/curso"
 *
 * body - O corpo da requisição (preenchido pelo middleware bodyJson depois)
 *   Inicializado como {} vazio aqui
 *   O middleware bodyJson vai ler e parsear se for JSON
 *
 * params - Os parâmetros dinâmicos da rota (preenchido pelo router depois)
 *   Exemplo: Rota "/products/:slug" com URL "/products/notebook"
 *   -> params fica { slug: "notebook" }
 *
 * ----------------------------------------------------------------------------
 * FUNÇÃO customRequest() - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * Pega a requisição bruta do Node.js e prepara tudo pra você usar fácil
 *
 * Passo a passo:
 *   1. Pega a URL e separa o caminho dos parâmetros
 *      Tipo: "/curso?slug=javascript" vira pathname="/curso" e query={slug:"javascript"}
 *
 *   2. Inicializa params como vazio {}
 *      (O router vai preencher depois quando encontrar parâmetros dinâmicos)
 *
 *   3. Inicializa body como vazio {}
 *      (O middleware bodyJson vai preencher depois se for JSON)
 *
 *   4. Retorna a requisição toda arrumada e pronta pra usar
 *      O body será preenchido pelo middleware bodyJson depois
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * customRequest = pega requisição complicada e deixa fácil de usar
 * Adiciona: query, pathname, body (vazio), params (vazio)
 * body será preenchido pelo middleware bodyJson depois
 * params será preenchido pelo router depois
 * Você só precisa usar req.query, req.pathname, etc. sem se preocupar com detalhes
 */
