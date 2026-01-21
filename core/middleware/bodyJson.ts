import type { Middleware } from "../router.ts";

export const bodyJson: Middleware = async (req, res) => {
  if (
    req.headers["content-type"] !== "application/json" &&
    req.headers["content-type"] !== "application/json;charset=utf-8"
  ) {
    return;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString("utf-8");

  if (body === "") {
    req.body = {};
    return;
  }

  req.body = JSON.parse(body);
};

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo cria um middleware que lê o body JSON das requisições
 * É registrado automaticamente como middleware global no Core
 *
 * ----------------------------------------------------------------------------
 * MIDDLEWARE bodyJson - O QUE ELE FAZ?
 * ----------------------------------------------------------------------------
 * Lê o corpo da requisição e converte de JSON pra objeto JavaScript
 * Só funciona se o Content-Type for "application/json"
 *
 * Como funciona:
 *   1. Verifica se o Content-Type é JSON
 *      Se não for, não faz nada (retorna)
 *
 *   2. Lê o corpo da requisição em chunks (pedaços)
 *      Como o stream pode vir em múltiplas partes, junta tudo
 *
 *   3. Converte os chunks pra string UTF-8
 *
 *   4. Se o body estiver vazio, deixa req.body = {}
 *
 *   5. Se tiver conteúdo, faz JSON.parse() e coloca em req.body
 *
 * ----------------------------------------------------------------------------
 * QUANDO É EXECUTADO?
 * ----------------------------------------------------------------------------
 * É registrado automaticamente no Core como middleware global
 * Roda em TODAS as requisições, antes de procurar a rota
 *
 * Isso significa que:
 *   - Se você fizer POST com JSON, req.body já vem parseado
 *   - Se não for JSON, req.body fica {} (vazio)
 *   - Você não precisa fazer JSON.parse() manualmente
 *
 * ----------------------------------------------------------------------------
 * EXEMPLO DE USO
 * ----------------------------------------------------------------------------
 * // No handler, você já tem req.body pronto:
 * core.router.post("/products", (req, res) => {
 *   const { name, slug, price } = req.body // já é objeto!
 *   // não precisa fazer JSON.parse()
 * })
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * bodyJson = middleware que lê body JSON automaticamente
 * Registrado automaticamente no Core (não precisa registrar manualmente)
 * Roda em todas as requisições
 * Se Content-Type for JSON, parseia e coloca em req.body
 * Se não for JSON ou estiver vazio, req.body = {}
 */
