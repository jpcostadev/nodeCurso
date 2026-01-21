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
 * body - O corpo da requisição (quando você envia dados no POST)
 *   Se for JSON, já vem parseado (convertido em objeto)
 *   Se não for JSON, fica vazio {}
 *
 * params - Os parâmetros dinâmicos da rota (preenchido pelo router depois)
 *   Exemplo: Rota "/curso/:curso" com URL "/curso/javascript"
 *   -> params fica { curso: "javascript" }
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
 *   3. Lê o corpo da requisição (se tiver)
 *      Como pode vir em pedaços, junta tudo primeiro
 *
 *   4. Se o corpo for JSON, converte pra objeto
 *      Se não for JSON, deixa vazio
 *
 *   5. Retorna a requisição toda arrumada e pronta pra usar
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * customRequest = pega requisição complicada e deixa fácil de usar
 * Adiciona: query, pathname, body, params
 * Você só precisa usar req.query, req.pathname, etc. sem se preocupar com detalhes
 */
