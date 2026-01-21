import { DatabaseSync, type StatementSync } from "node:sqlite";

export class Database extends DatabaseSync {
  queries: Record<string, StatementSync>;

  constructor(path: string) {
    super(path);
    this.queries = {};
    this.exec(/*sql */ `
    PRAGMA foreign_keys = 1;
     PRAGMA journal_mode = DELETE;
     PRAGMA synchronous = NORMAL;

     PRAGMA cache_size = 2000;
     PRAGMA busy_timeout = 5000;
     PRAGMA temp_store = MEMORY;
      `);
  }

  query(sql: string) {
    if (!this.queries[sql]) {
      this.queries[sql] = this.prepare(sql);
    }
    return this.queries[sql];
  }
}

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo cria uma classe Database que estende DatabaseSync do Node.js
 * Adiciona cache de queries preparadas pra melhorar performance
 *
 * ----------------------------------------------------------------------------
 * CLASSE Database - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * É um wrapper do DatabaseSync do node:sqlite que adiciona:
 * - Cache de queries preparadas (pra não preparar a mesma query várias vezes)
 * - Configurações otimizadas do SQLite (PRAGMAs)
 *
 * queries - Objeto que guarda queries já preparadas
 * Formato: { "SELECT * FROM ...": StatementSync, ... }
 * Se você chamar query() com a mesma SQL, retorna a query já preparada
 *
 * ----------------------------------------------------------------------------
 * CONSTRUTOR - O QUE ACONTECE QUANDO CRIA?
 * ----------------------------------------------------------------------------
 * Quando você faz: new Database("./lms.sqlite")
 *
 * Ele:
 *   1. Conecta ao banco SQLite no caminho especificado
 *   2. Configura PRAGMAs do SQLite pra melhor performance:
 *      - foreign_keys = 1 (ativa chaves estrangeiras)
 *      - journal_mode = DELETE (modo de journal)
 *      - synchronous = NORMAL (sincronização)
 *      - cache_size = 2000 (tamanho do cache)
 *      - busy_timeout = 5000 (timeout quando ocupado)
 *      - temp_store = MEMORY (armazena temporários na memória)
 *   3. Inicializa o cache de queries vazio
 *
 * ----------------------------------------------------------------------------
 * MÉTODO query(sql) - Preparar query com cache
 * ----------------------------------------------------------------------------
 * Prepara uma query SQL e guarda no cache
 * Se você chamar de novo com a mesma SQL, retorna a query já preparada
 * (Isso é mais rápido que preparar toda vez)
 *
 * Exemplo:
 *   const stmt = core.db.query(`SELECT * FROM products WHERE slug = ?`)
 *   const product = stmt.get("notebook") // executa a query
 *
 * Se você chamar query() de novo com a mesma SQL, retorna o mesmo StatementSync
 * (não precisa preparar de novo)
 *
 * ----------------------------------------------------------------------------
 * MÉTODOS HERDADOS DO DatabaseSync
 * ----------------------------------------------------------------------------
 * Você também pode usar métodos diretos do DatabaseSync:
 *
 * exec(sql) - Executa SQL direto (CREATE TABLE, INSERT, etc)
 *   Exemplo: core.db.exec(`CREATE TABLE ...`)
 *
 * prepare(sql) - Prepara uma query (sem cache)
 *   Exemplo: core.db.prepare(`SELECT * FROM ...`).get(param)
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * Database = wrapper do SQLite com cache de queries
 * query(sql) = prepara e cacheia queries (mais rápido)
 * exec(sql) = executa SQL direto (CREATE, INSERT, etc)
 * prepare(sql) = prepara query sem cache (se não quiser cachear)
 * Use query() quando for usar a mesma query várias vezes
 */
