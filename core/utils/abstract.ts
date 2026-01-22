import type { Core } from "../core.ts";
import type { Handler } from "../router.ts";

export abstract class CoreProvider {
  core: Core;
  router: Core["router"];
  db: Core["db"];
  constructor(core: Core) {
    this.core = core;
    this.router = core.router;
    this.db = core.db;
  }
}

export abstract class Api extends CoreProvider {
  handlers: Record<string, Handler> = {};
  /*Utilize para criar as tabelas*/
  tables() {}
  /*Utilize para criar as rotas*/
  routes() {}

  init() {
    this.tables();
    this.routes();
  }
}

export abstract class Query {
  db: Core["db"];
  constructor(db: Core["db"]) {
    this.db = db;
  }
}

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo define classes abstratas pra organizar o código
 * É um padrão de design que ajuda a estruturar suas APIs de forma consistente
 *
 * ----------------------------------------------------------------------------
 * CLASSE CoreProvider - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * Classe base que dá acesso fácil ao Core, router e db
 * Quando você cria uma classe que estende CoreProvider, você tem acesso a:
 *   - this.core (instância completa do Core)
 *   - this.router (atalho pra core.router)
 *   - this.db (atalho pra core.db)
 *
 * Exemplo:
 *   class MinhaClasse extends CoreProvider {
 *     fazerAlgo() {
 *       this.router.get("/", ...) // acesso ao router
 *       this.db.exec("...") // acesso ao banco
 *     }
 *   }
 *
 * ----------------------------------------------------------------------------
 * CLASSE Api - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * Classe abstrata que estende CoreProvider
 * É a base pra criar APIs organizadas (como ProductApi)
 *
 * PROPRIEDADES:
 * handlers - Objeto que guarda todos os handlers da API
 *   Formato: { nomeDoHandler: (req, res) => { ... } }
 *   Use isso pra organizar seus handlers
 *
 * MÉTODOS:
 * tables() - Método abstrato que você implementa
 *   Coloque aqui o código que cria as tabelas do banco
 *   Exemplo: CREATE TABLE, INSERT dados iniciais, etc
 *
 * routes() - Método abstrato que você implementa
 *   Coloque aqui o código que registra as rotas
 *   Exemplo: router.get("/rota", this.handlers.meuHandler)
 *
 * init() - Método que chama tables() e routes() na ordem
 *   Use isso pra inicializar a API: new MinhaApi(core).init()
 *
 * ----------------------------------------------------------------------------
 * COMO USAR (CRIAR UMA API)
 * ----------------------------------------------------------------------------
 * 1. Crie uma classe que estende Api:
 *    export class MinhaApi extends Api {
 *      handlers = {
 *        buscar: (req, res) => {
 *          const item = this.db.query(`SELECT ...`).get(req.params.id)
 *          res.json(item)
 *        },
 *        criar: (req, res) => {
 *          // lógica aqui
 *        }
 *      }
 *
 *      tables() {
 *        this.db.exec(`CREATE TABLE IF NOT EXISTS ...`)
 *      }
 *
 *      routes() {
 *        this.router.get("/items/:id", this.handlers.buscar)
 *        this.router.post("/items", this.handlers.criar)
 *      }
 *    }
 *
 * 2. No index.ts, inicialize:
 *    const core = new Core()
 *    new MinhaApi(core).init()
 *
 * ----------------------------------------------------------------------------
 * VANTAGENS DESSE PADRÃO
 * ----------------------------------------------------------------------------
 * - Organiza código por módulo (cada API no seu arquivo)
 * - Separa criação de tabelas das rotas
 * - Facilita reutilização (handlers organizados)
 * - Acesso fácil a core, router e db
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * CoreProvider = dá acesso a core, router e db
 * Api = classe base pra criar APIs organizadas
 * handlers = objeto com todos os handlers da API
 * tables() = método pra criar tabelas (você implementa)
 * routes() = método pra registrar rotas (você implementa)
 * init() = chama tables() e routes() automaticamente
 */
