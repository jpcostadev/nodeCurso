# Framework de API REST

Um framework simples e poderoso para criar APIs REST em Node.js com TypeScript, SQLite e sistema de rotas modular.

## 📋 Índice

- [Características](#características)
- [Instalação](#instalação)
- [Início Rápido](#início-rápido)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pasta de Estudo e Scripts](#pasta-de-estudo-e-scripts)
- [Conceitos Fundamentais](#conceitos-fundamentais)
- [Criando uma API](#criando-uma-api)
- [Sistema de Rotas](#sistema-de-rotas)
- [Banco de Dados](#banco-de-dados)
- [Middlewares](#middlewares)
- [Tratamento de Erros](#tratamento-de-erros)
- [Exemplos Completos](#exemplos-completos)
- [APIs Incluídas](#apis-incluídas)
- [Rotas do LMS](#rotas-do-lms)
- [Rotas de Autenticação](#rotas-de-autenticação)
- [Observações Importantes](#observações-importantes)
- [API Reference](#api-reference)

## ✨ Características

- 🚀 **Simples e Intuitivo**: API limpa e fácil de usar
- 📦 **Modular**: Organize suas APIs em módulos separados
- 🗄️ **SQLite Integrado**: Banco de dados embutido com cache de queries
- 🛣️ **Sistema de Rotas**: Suporte a rotas dinâmicas e parâmetros
- 🔌 **Middlewares**: Sistema flexível de middlewares globais e por rota
- 📝 **TypeScript**: Totalmente tipado para melhor desenvolvimento
- ⚡ **Performance**: Cache automático de queries preparadas
- 🎯 **Sem Dependências de Runtime**: Apenas Node.js e TypeScript (dev deps opcionais)

## 📦 Instalação

1. Clone o repositório ou copie os arquivos do framework
2. Instale as dependências:

```bash
npm install
```

3. Certifique-se de ter Node.js 22+ instalado (usa `node:sqlite`)

## 🚀 Início Rápido

### 1. Criar o arquivo principal (index.ts)

```typescript
import { Core } from "./core/core.ts";
import { AuthApi } from "./api/auth/index.ts";
import { LmshApi } from "./api/lms/index.ts";

const core = new Core();

// Registre suas APIs
new AuthApi(core).init();
new LmshApi(core).init();

// Inicie o servidor
core.init();
```

### 2. Criar uma API simples

```typescript
// api/minha-api/index.ts
import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/routeError.ts";

export class MinhaApi extends Api {
  handlers = {
    buscar: (req, res) => {
      const item = this.db
        .query(`SELECT * FROM items WHERE id = ?`)
        .get(req.params.id);
      if (!item) {
        throw new RouteError(404, "Item não encontrado");
      }
      res.status(200).json(item);
    },

    criar: (req, res) => {
      const { name, description } = req.body;
      const result = this.db
        .query(`INSERT INTO items (name, description) VALUES (?, ?)`)
        .run(name, description);
      res.status(201).json({ id: result.lastInsertRowid });
    },
  };

  tables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      )
    `);
  }

  routes() {
    this.router.get("/items/:id", this.handlers.buscar);
    this.router.post("/items", this.handlers.criar);
  }
}
```

### 3. Executar

```bash
npx tsx --watch index.ts
```

O servidor estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
projeto/
├── core/                    # Código principal do framework
│   ├── core.ts              # Classe Core (servidor + router + database)
│   ├── router.ts            # Sistema de rotas
│   ├── database.ts          # Wrapper do SQLite com cache
│   ├── http/                # Helpers HTTP
│   │   ├── customRequest.ts # Transforma requisições
│   │   └── customResponse.ts # Transforma respostas
│   ├── middleware/          # Middlewares prontos
│   │   ├── bodyJson.ts      # Parser de JSON
│   │   └── logger.ts        # Logger de requisições
│   └── utils/               # Utilitários
│       ├── abstract.ts      # Classes base (Api, Query)
│       └── routeError.ts    # Erro HTTP customizado
├── api/                     # Suas APIs organizadas
│   ├── products/            # API de produtos
│   ├── auth/               # API de autenticação
│   └── lms/                 # API de LMS
├── estudo/                  # Arquivos de estudo e protótipos
├── client.js                # Cliente de teste via CLI
├── index.ts                 # Arquivo principal
└── README.md                # Esta documentação
```

## 🧪 Pasta de Estudo e Scripts

- `estudo/`: protótipos e versões simplificadas do servidor/rotas.
- `client.js`: utilitário de testes via linha de comando para a API atual.

## 🎓 Conceitos Fundamentais

### Core

O `Core` é o coração do framework. Ele coordena:

- **Servidor HTTP**: Escuta requisições na porta 3000
- **Router**: Gerencia todas as rotas
- **Database**: Conexão com SQLite

```typescript
const core = new Core();
// Agora você tem: core.router, core.server, core.db
```

### Api (Classe Abstrata)

A classe `Api` fornece uma estrutura organizada para criar APIs:

```typescript
export class MinhaApi extends Api {
  handlers = {
    /* seus handlers */
  };
  tables() {
    /* cria tabelas */
  }
  routes() {
    /* registra rotas */
  }
}
```

### Handlers

Handlers são funções que processam requisições:

```typescript
handlers = {
  meuHandler: (req, res) => {
    // req contém: query, pathname, body, params
    // res contém: status(), json()
    res.status(200).json({ message: "Sucesso" });
  },
};
```

## 🛠️ Criando uma API

### Passo 1: Criar a classe

```typescript
import { Api } from "../../core/utils/abstract.ts";

export class MinhaApi extends Api {
  // Seus handlers aqui
  handlers = {};

  // Criação de tabelas
  tables() {}

  // Registro de rotas
  routes() {}
}
```

### Passo 2: Implementar handlers

```typescript
handlers = {
  listar: (req, res) => {
    const items = this.db.prepare(`SELECT * FROM items`).all();
    res.json(items);
  },

  buscar: (req, res) => {
    const { id } = req.params;
    const item = this.db.query(`SELECT * FROM items WHERE id = ?`).get(id);
    if (!item) {
      throw new RouteError(404, "Item não encontrado");
    }
    res.json(item);
  },

  criar: (req, res) => {
    const { name, description } = req.body;
    const result = this.db
      .query(
        `
      INSERT INTO items (name, description) VALUES (?, ?)
    `,
      )
      .run(name, description);

    res.status(201).json({ id: result.lastInsertRowid });
  },

  atualizar: (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = this.db
      .query(
        `
      UPDATE items SET name = ?, description = ? WHERE id = ?
    `,
      )
      .run(name, description, id);

    if (result.changes === 0) {
      throw new RouteError(404, "Item não encontrado");
    }

    res.json({ message: "Atualizado com sucesso" });
  },

  deletar: (req, res) => {
    const { id } = req.params;
    const result = this.db.query(`DELETE FROM items WHERE id = ?`).run(id);

    if (result.changes === 0) {
      throw new RouteError(404, "Item não encontrado");
    }

    res.status(204).end();
  },
};
```

### Passo 3: Criar tabelas

```typescript
tables() {
  this.db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
```

### Passo 4: Registrar rotas

```typescript
routes() {
  this.router.get("/items", this.handlers.listar);
  this.router.get("/items/:id", this.handlers.buscar);
  this.router.post("/items", this.handlers.criar);
  this.router.put("/items/:id", this.handlers.atualizar);
  this.router.delete("/items/:id", this.handlers.deletar);
}
```

### Passo 5: Inicializar no index.ts

```typescript
const core = new Core();
new MinhaApi(core).init();
core.init();
```

## 🛣️ Sistema de Rotas

### Rotas Básicas

```typescript
// GET
this.router.get("/rota", handler);

// POST
this.router.post("/rota", handler);

// PUT
this.router.put("/rota", handler);

// DELETE
this.router.delete("/rota", handler);

// HEAD
this.router.head("/rota", handler);
```

### Rotas com Parâmetros Dinâmicos

Use `:` para criar parâmetros dinâmicos:

```typescript
// Rota: /products/:slug
// URL: /products/notebook
// req.params = { slug: "notebook" }

this.router.get("/products/:slug", (req, res) => {
  const { slug } = req.params;
  // slug = "notebook"
});
```

### Múltiplos Parâmetros

```typescript
// Rota: /users/:userId/posts/:postId
// URL: /users/123/posts/456
// req.params = { userId: "123", postId: "456" }

this.router.get("/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;
});
```

### Query String

```typescript
// URL: /products?page=1&limit=10
// req.query.get("page") = "1"
// req.query.get("limit") = "10"

this.router.get("/products", (req, res) => {
  const page = req.query.get("page") || "1";
  const limit = req.query.get("limit") || "10";
});
```

## 🗄️ Banco de Dados

### Métodos Disponíveis

#### exec() - Executar SQL Direto

```typescript
// Para CREATE, INSERT, UPDATE, DELETE simples
this.db.exec(`CREATE TABLE items ...`);
this.db.exec(`INSERT INTO items VALUES ...`);
```

#### query() - Query com Cache

```typescript
// Prepara e cacheia a query (mais rápido para queries repetidas)
const stmt = this.db.query(`SELECT * FROM items WHERE id = ?`);
const item = stmt.get(1);
const item2 = stmt.get(2); // Usa o cache!
```

#### prepare() - Query sem Cache

```typescript
// Prepara sem cache (mais flexível)
const stmt = this.db.prepare(`SELECT * FROM items WHERE name = ?`);
const items = stmt.all("Produto");
```

### Métodos do Statement

```typescript
// .get() - Retorna uma linha (ou undefined)
const item = stmt.get(param);

// .all() - Retorna todas as linhas (array)
const items = stmt.all();

// .run() - Executa INSERT/UPDATE/DELETE
const result = stmt.run(param1, param2);
// result.changes - número de linhas afetadas
// result.lastInsertRowid - ID do último insert
```

### Exemplos Práticos

```typescript
// Buscar um item
const item = this.db.query(`SELECT * FROM items WHERE id = ?`).get(id);

// Listar todos
const items = this.db.prepare(`SELECT * FROM items`).all();

// Criar
const result = this.db
  .query(
    `
  INSERT INTO items (name, description) VALUES (?, ?)
`,
  )
  .run(name, description);
const newId = result.lastInsertRowid;

// Atualizar
const result = this.db
  .query(
    `
  UPDATE items SET name = ? WHERE id = ?
`,
  )
  .run(newName, id);

// Deletar
const result = this.db.query(`DELETE FROM items WHERE id = ?`).run(id);
```

## 🔌 Middlewares

### Middlewares Globais

Middlewares globais rodam em TODAS as rotas:

```typescript
// No index.ts
const core = new Core();
core.router.use([logger, cors, autenticacao]);
```

### Middlewares por Rota

Middlewares específicos rodam apenas em rotas específicas:

```typescript
this.router.get("/rota-protegida", handler, [autenticacao, autorizacao]);
```

### Ordem de Execução

1. Middlewares globais (registrados com `use()`)
2. Middlewares específicos da rota
3. Handler da rota

### Criar um Middleware

```typescript
import type { Middleware } from "../router.ts";

export const meuMiddleware: Middleware = (req, res) => {
  // Faça algo antes do handler
  console.log(`${req.method} ${req.pathname}`);

  // Você pode modificar req ou res
  // Você pode interromper a execução (não chamar o próximo)
};
```

### Middlewares Prontos

#### bodyJson (já registrado automaticamente)

Lê e parseia o body JSON automaticamente:

```typescript
// Já está registrado no Core, não precisa fazer nada
// req.body já vem parseado em rotas POST/PUT
```

#### logger

```typescript
import { logger } from "./core/middleware/logger.ts";

core.router.use([logger]);
```

## ⚠️ Tratamento de Erros

### RouteError

Use `RouteError` para retornar erros HTTP:

```typescript
import { RouteError } from "../../core/utils/routeError.ts";

// Erro 404
throw new RouteError(404, "Recurso não encontrado");

// Erro 400
throw new RouteError(400, "Dados inválidos");

// Erro 401
throw new RouteError(401, "Não autorizado");

// Erro 500
throw new RouteError(500, "Erro interno");
```

O Core captura automaticamente e retorna JSON:

```json
{
  "status": 404,
  "title": "Recurso não encontrado"
}
```

### Exemplo Completo

```typescript
handlers = {
  buscar: (req, res) => {
    const { id } = req.params;
    const item = this.db.query(`SELECT * FROM items WHERE id = ?`).get(id);

    if (!item) {
      throw new RouteError(404, "Item não encontrado");
    }

    res.json(item);
  },
};
```

## ✅ Rotas Atuais

Rotas registradas no `index.ts` deste projeto:

### Auth

**POST /auth/user**

Body:

```json
{
  "name": "Pedro",
  "username": "fallz",
  "email": "fallz@email.com",
  "password": "123456"
}
```

Resposta:

```json
{ "title": "Usuário criado com sucesso" }
```

### LMS

**POST /lms/course**

Body:

```json
{
  "slug": "js-do-zero",
  "title": "JavaScript do Zero",
  "description": "Curso completo",
  "lessons": 20,
  "hours": 10
}
```

**POST /lms/lesson**

Body:

```json
{
  "courseSlug": "js-do-zero",
  "slug": "aula-1",
  "title": "Introdução",
  "seconds": 600,
  "video": "https://exemplo.com/video",
  "description": "Bem-vindo",
  "order": 1,
  "free": 1
}
```

**GET /lms/courses**

Retorna lista de cursos ou 404 se não houver.

**GET /lms/course/:slug**

Retorna:

```json
{
  "course": { "id": 1, "slug": "js-do-zero" },
  "lessons": [{ "id": 1, "slug": "aula-1" }],
  "completed": [{ "lesson_id": 1, "completed": "2026-01-28 12:00:00" }]
}
```

**GET /lms/lesson/:courseSlug/:lessonSlug**

Retorna a aula com navegação:

```json
{
  "slug": "aula-1",
  "prev": null,
  "next": "aula-2",
  "completed": "2026-01-28 12:00:00"
}
```

**POST /lms/lesson/complete**

Body:

```json
{ "courseId": 1, "lessonId": 1 }
```

**DELETE /lms/course/reset**

Body:

```json
{ "courseId": 1 }
```

## 📚 Exemplos Completos

### API de Produtos

```typescript
import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/routeError.ts";

export class ProductApi extends Api {
  handlers = {
    buscar: (req, res) => {
      const { slug } = req.params;
      const product = this.db
        .query(
          `
        SELECT * FROM products WHERE slug = ?
      `,
        )
        .get(slug);

      if (!product) {
        throw new RouteError(404, "Produto não encontrado");
      }

      res.json(product);
    },

    criar: (req, res) => {
      const { name, slug, price } = req.body;

      const result = this.db
        .query(
          `
        INSERT INTO products (name, slug, price) VALUES (?, ?, ?)
      `,
        )
        .run(name, slug, price);

      res.status(201).json({ id: result.lastInsertRowid });
    },
  };

  tables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        price INTEGER
      )
    `);
  }

  routes() {
    this.router.get("/products/:slug", this.handlers.buscar);
    this.router.post("/products", this.handlers.criar);
  }
}
```

### API com Classe Query

```typescript
// api/products/query.ts
import { Query } from "../../core/utils/abstract.ts";

export class ProductQuery extends Query {
  selectBySlug(slug: string) {
    return this.db.query(`SELECT * FROM products WHERE slug = ?`).get(slug);
  }

  insert(name: string, slug: string, price: number) {
    return this.db
      .query(
        `
      INSERT INTO products (name, slug, price) VALUES (?, ?, ?)
    `,
      )
      .run(name, slug, price);
  }
}

// api/products/index.ts
export class ProductApi extends Api {
  query = new ProductQuery(this.db);

  handlers = {
    buscar: (req, res) => {
      const product = this.query.selectBySlug(req.params.slug);
      if (!product) {
        throw new RouteError(404, "Produto não encontrado");
      }
      res.json(product);
    },
  };

  // ...
}
```

## 📦 APIs Incluídas

Atualmente, `index.ts` registra estas APIs:

- `AuthApi` (autenticação básica)
- `LmshApi` (LMS: cursos, aulas e progresso)

`ProductApi` existe como exemplo de estudo, mas **não é inicializada** no `index.ts`.

## 🎓 Rotas do LMS

Base: `/lms`

### POST `/lms/course`

Cria um curso.

Body:

```json
{
  "slug": "javascript-completo",
  "title": "JavaScript Completo",
  "description": "Curso completo",
  "lessons": 80,
  "hours": 20
}
```

Resposta 200:

```json
{
  "id": 1,
  "changes": 1,
  "title": "curso criado com sucesso"
}
```

### POST `/lms/lesson`

Cria uma aula vinculada a um curso.

Body:

```json
{
  "courseSlug": "javascript-completo",
  "slug": "introducao",
  "title": "Introdução",
  "seconds": 600,
  "video": "https://...",
  "description": "Primeira aula",
  "order": 1,
  "free": 1
}
```

Resposta 200:

```json
{
  "id": 1,
  "changes": 1,
  "title": "aula criada"
}
```

### GET `/lms/courses`

Lista cursos. Se não houver cursos, retorna 404 com `"Nenhum curso encontrdo."`.

### GET `/lms/course/:slug`

Retorna um curso e suas aulas:

```json
{
  "course": { "id": 1, "slug": "javascript-completo" },
  "lessons": [
    /* aulas */
  ],
  "completed": [
    /* aulas completadas pelo usuário */
  ]
}
```

Observação: `userId` está fixo como `1` no código atual.

### GET `/lms/lesson/:courseSlug/:lessonSlug`

Retorna detalhes de uma aula e navegação:

```json
{
  "id": 10,
  "slug": "introducao",
  "prev": null,
  "next": "variaveis",
  "completed": "2026-01-28 10:00:00"
}
```

Observação: `userId` está fixo como `1` no código atual.

### POST `/lms/lesson/complete`

Marca aula como concluída.

Body:

```json
{
  "courseId": 1,
  "lessonId": 10
}
```

Resposta 201:

```json
{
  "title": "Aula concluída"
}
```

### DELETE `/lms/course/reset`

Reseta o progresso do curso (para `userId` fixo).

Body:

```json
{
  "courseId": 1
}
```

Resposta 201:

```json
"curso resetado"
```

## 🔐 Rotas de Autenticação

Base: `/auth`

### POST `/auth/user`

Cria um usuário.

Body:

```json
{
  "name": "Pedro",
  "username": "fallz",
  "email": "fallz@email.com",
  "password": "123456"
}
```

Resposta 201:

```json
{
  "title": "Usuário criado com sucesso"
}
```

Observação: no código atual, o campo `password_hash` recebe a senha **sem hash**.

## ✅ Observações Importantes

- O `LmshApi` cria tabelas que dependem de `users`, então `AuthApi` deve ser inicializada antes.
- `ProductApi` é um exemplo e não está registrada no `index.ts`.
- `bodyJson` só processa `Content-Type: application/json`.

## 📖 API Reference

### Core

```typescript
class Core {
  router: Router;
  server: Server;
  db: Database;

  constructor();
  init(): void;
}
```

### Router

```typescript
class Router {
  routes: Routes;
  middlewares: Middleware[];

  get(route: string, handler: Handler, middlewares?: Middleware[]): void;
  post(route: string, handler: Handler, middlewares?: Middleware[]): void;
  put(route: string, handler: Handler, middlewares?: Middleware[]): void;
  delete(route: string, handler: Handler, middlewares?: Middleware[]): void;
  head(route: string, handler: Handler, middlewares?: Middleware[]): void;
  use(middlewares: Middleware[]): void;
  find(method: string, pathname: string): { route; params } | null;
}
```

### Database

```typescript
class Database extends DatabaseSync {
  queries: Record<string, StatementSync>;

  constructor(path: string);
  query(sql: string): StatementSync;
  // Herda: exec(), prepare()
}
```

### Api (Classe Abstrata)

```typescript
abstract class Api extends CoreProvider {
  handlers: Record<string, Handler>;

  tables(): void;
  routes(): void;
  init(): void;
}
```

### CustomRequest

```typescript
interface CustomRequest extends IncomingMessage {
  query: URLSearchParams;
  pathname: string;
  body: Record<string, any>;
  params: Record<string, any>;
}
```

### CustomResponse

```typescript
interface CustomResponse extends ServerResponse {
  status(code: number): CustomResponse;
  json(data: any): void;
}
```

## 🎯 Boas Práticas

1. **Organize por Módulos**: Cada API em seu próprio arquivo/pasta
2. **Use Query para Queries Complexas**: Separe queries SQL em classes Query
3. **Trate Erros**: Sempre use RouteError para erros HTTP
4. **Cache de Queries**: Use `query()` para queries executadas frequentemente
5. **Valide Dados**: Valide req.body antes de usar
6. **Use TypeScript**: Aproveite a tipagem para melhor desenvolvimento

## 🚧 Próximos Passos

- Adicione autenticação com middlewares
- Implemente validação de dados
- Crie testes para suas APIs
- Adicione mais middlewares conforme necessário
- Explore as APIs de exemplo (products, auth, lms)

## 📝 Notas

- O servidor roda na porta 3000 por padrão
- O banco SQLite é criado automaticamente no caminho `./lms.sqlite`
- bodyJson é registrado automaticamente como middleware global
- Todas as rotas não encontradas retornam 404 automaticamente
- Erros são capturados e retornados como JSON (RFC 7807)
- Nos endpoints de progresso do LMS, o `userId` está fixo em 1 (placeholder)

## 🤝 Contribuindo

Este é um framework em desenvolvimento. Sinta-se livre para:

- Reportar bugs
- Sugerir melhorias
- Adicionar funcionalidades
- Melhorar a documentação

---

## 👨‍💻 Desenvolvedor

**Desenvolvido por Pedro Costa**

Conhecido como **Fallz**

- 📷 Instagram: [@fallz.dev](https://instagram.com/fallz.dev)
- 🎵 TikTok: [@fallzoficial](https://tiktok.com/@fallzoficial)
- 📧 Email: fallz.developer@gmail.com

---

**Desenvolvido com ❤️ para facilitar a criação de APIs REST em Node.js**
