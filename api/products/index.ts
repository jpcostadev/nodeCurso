import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/routeError.ts";

export class ProductApi extends Api {
  handlers = {
    getProdutcs: (req, res) => {
      const { slug } = req.params;
      const product = this.core.db
        .query(
          /*sql */ `
    SELECT * FROM "products" WHERE "slug" = ?
    `,
        )
        .get(slug);
      if (!product) {
        throw new RouteError(404, "Produto não encontrado");
      }
      res.status(200).json(product);
    },
  } satisfies Api["handlers"];

  tables(): void {
    this.core.db.exec(/*sql*/ `DROP TABLE "products"`);
    // this.core.db.exec(/*sql */ `
    //       CREATE TABLE IF NOT EXISTS "products" (
    //         "id" INTEGER NOT NULL PRIMARY KEY,
    //         "name" TEXT NOT NULL,
    //         "slug" TEXT NOT NULL UNIQUE,
    //         "price" INTEGER
    //       );
    //       INSERT OR IGNORE INTO "products"
    //       ("name" ,"slug", "price") VALUES
    //       ( 'Notebook', 'notebook', 4000)
    //       `);
  }
  routes(): void {
    this.core.router.get("/products/:slug", this.handlers.getProdutcs);

    this.core.router.get("/", (req, res) => {
      res.status(200).json("Hello World");
    });
  }
}

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo cria a API de produtos usando o padrão Api
 * É um exemplo de como organizar uma API no framework
 *
 * ----------------------------------------------------------------------------
 * CLASSE ProductApi - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * Estende Api, então tem acesso a:
 *   - this.core (instância do Core)
 *   - this.router (atalho pra core.router)
 *   - this.db (atalho pra core.db)
 *
 * PROPRIEDADE handlers:
 * Objeto que guarda todos os handlers da API de produtos
 * Cada handler é uma função que recebe req e res
 *
 * MÉTODO tables():
 * Cria as tabelas do banco de dados
 * Nesse caso, cria a tabela "products" com:
 *   - id (INTEGER PRIMARY KEY - auto-increment)
 *   - name (TEXT NOT NULL)
 *   - slug (TEXT NOT NULL UNIQUE)
 *   - price (INTEGER)
 * Também insere um produto inicial (Notebook)
 *
 * MÉTODO routes():
 * Registra todas as rotas da API de produtos
 * Nesse caso:
 *   - GET /products/:slug - busca produto pelo slug
 *   - GET / - rota raiz
 *
 * ----------------------------------------------------------------------------
 * HANDLER getProdutcs - COMO FUNCIONA?
 * ----------------------------------------------------------------------------
 * 1. Pega o slug dos parâmetros: const { slug } = req.params
 *    (O router já extraiu da URL automaticamente)
 *
 * 2. Busca o produto no banco:
 *    this.core.db.query(sql).get(slug)
 *    - query() prepara e cacheia a query SQL
 *    - get(slug) executa com o parâmetro
 *
 * 3. Se não encontrar, lança RouteError(404)
 *    (O Core captura e retorna JSON de erro)
 *
 * 4. Se encontrar, retorna o produto em JSON
 *
 * ----------------------------------------------------------------------------
 * COMO USAR
 * ----------------------------------------------------------------------------
 * No index.ts:
 *   const core = new Core()
 *   new ProductApi(core).init()
 *
 * Isso vai:
 *   1. Criar a tabela products (se não existir)
 *   2. Inserir produto inicial (se não existir)
 *   3. Registrar as rotas
 *
 * ----------------------------------------------------------------------------
 * ROTAS DISPONÍVEIS
 * ----------------------------------------------------------------------------
 * GET /products/:slug
 *   Busca um produto pelo slug
 *   Exemplo: GET /products/notebook
 *   - req.params.slug = "notebook"
 *   - Retorna produto ou 404
 *
 * GET /
 *   Rota raiz
 *   - Retorna "Hello World"
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * ProductApi = exemplo de API organizada usando o padrão Api
 * handlers = objeto com todos os handlers
 * tables() = cria tabelas do banco
 * routes() = registra rotas
 * init() = chama tables() e routes() automaticamente
 * Use como modelo pra criar outras APIs
 */
