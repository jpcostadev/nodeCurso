import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./db.sqlite");

db.exec(/*sql*/ `
  PRAGMA foreign_keys = 1;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;
`);

db.exec(/*sql*/ `
    CREATE TABLE IF NOT EXISTS "produtos"(
        "nome" TEXT NOT NULL,
        "slug" TEXT PRIMARY KEY,
        "categoria" TEXT NOT NULL,
        "preco" INTEGER NOT NULL
    );
    `);

const insert = db.prepare(/*sql*/ `
    INSERT OR IGNORE INTO "produtos"
    ( "nome", "slug","categoria", "preco")
    VALUES
    (?,?,?,?)
    `);

insert.run("Notebook", "notebook", "eletronicos", 4000);
insert.run("Mouse", "mouse", "eletronicos", 500);
insert.run("Iphone XS", "smartphone", "eletronicos", 8400);
insert.run("Mesa", "mesa", "moveis", 2000);

const produtos = db.prepare(/*sql*/ `SELECT * FROM "produtos"`).get();

const produto = db
  .prepare(/*sql*/ `SELECT * FROM "produtos" WHERE "slug" = 'mouse'`)
  .get();

console.log(produto);
