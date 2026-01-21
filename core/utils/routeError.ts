export class RouteError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo cria uma classe de erro customizada pra erros HTTP
 * Quando você lança RouteError, o Core captura e retorna uma resposta JSON bonita
 *
 * ----------------------------------------------------------------------------
 * CLASSE RouteError - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * É uma classe de erro que tem um código de status HTTP
 * Estende Error do JavaScript, então funciona como erro normal
 * Mas tem a propriedade "status" pra indicar o código HTTP
 *
 * PROPRIEDADES:
 * status - Código de status HTTP (200, 404, 400, 500, etc)
 * message - Mensagem de erro (herdado de Error)
 *
 * ----------------------------------------------------------------------------
 * COMO USAR
 * ----------------------------------------------------------------------------
 * Nos seus handlers, quando quiser retornar um erro HTTP:
 *
 *   throw new RouteError(404, "Produto não encontrado")
 *   throw new RouteError(400, "Dados inválidos")
 *   throw new RouteError(500, "Erro no servidor")
 *
 * O Core vai capturar automaticamente e retornar:
 *   {
 *     "status": 404,
 *     "title": "Produto não encontrado"
 *   }
 * Com Content-Type: application/problem+json
 *
 * ----------------------------------------------------------------------------
 * EXEMPLO PRÁTICO
 * ----------------------------------------------------------------------------
 * core.router.get("/products/:slug", (req, res) => {
 *   const product = core.db.query(`SELECT ...`).get(req.params.slug)
 *   
 *   if (!product) {
 *     throw new RouteError(404, "Produto não encontrado")
 *   }
 *   
 *   res.json(product)
 * })
 *
 * Se o produto não existir, lança RouteError
 * O Core captura e retorna JSON de erro automaticamente
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * RouteError = erro HTTP customizado
 * Use throw new RouteError(status, mensagem) nos handlers
 * O Core captura e retorna JSON de erro automaticamente
 */
