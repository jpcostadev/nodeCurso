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

  // Tabelas
  tables(): void {
    this.core.db.exec(/*sql */ `
          CREATE TABLE IF NOT EXISTS "products" (
            "id" INTEGER NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL, 
            "slug" TEXT NOT NULL UNIQUE,
            "price" INTEGER
          );
          INSERT OR IGNORE INTO "products"
          ("name" ,"slug", "price") VALUES
          ( 'Notebook', 'notebook', 4000)
          `);
  }
  routes(): void {
    this.core.router.get("/products/:slug", this.handlers.getProdutcs);

    this.core.router.get("/", (req, res) => {
      res.status(200).json("Hello World");
    });
  }
}
