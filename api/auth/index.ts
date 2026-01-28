import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/routeError.ts";
import { AuthQuery } from "./query.ts";
import { authTables } from "./tables.ts";

export class AuthApi extends Api {
  query = new AuthQuery(this.db);

  handlers = {
    postUser: (req, res) => {
      const { name, username, email, password } = req.body;
      const password_hash = password;
      const writeResult = this.query.insertUser({
        name,
        username,
        email,
        role: "user",
        password_hash,
      });

      if (writeResult.changes === 0) {
        throw new RouteError(400, "Usuário já cadastrado");
      }
      res.status(201).json({ title: "Usuário criado com sucesso" });
    },
  } satisfies Api["handlers"];
  tables() {
    this.db.exec(authTables);
  }
  routes(): void {
    this.router.post("/auth/user", this.handlers.postUser);
  }
}

/*
 * ============================================================================
 * CLASSE AuthApi - API DE AUTENTICAÇÃO
 * ============================================================================
 *
 * Esta classe centraliza as rotas básicas de autenticação/cadastro.
 * Atualmente expõe apenas o endpoint de criação de usuário.
 *
 * ----------------------------------------------------------------------------
 * HANDLERS DISPONÍVEIS
 * ----------------------------------------------------------------------------
 *
 * postUser - Cria um novo usuário
 *   Rota: POST /auth/user
 *   Body: { name, username, email, password }
 *   Retorna: { title: "Usuário criado com sucesso" }
 *
 * ----------------------------------------------------------------------------
 * COMO USAR
 * ----------------------------------------------------------------------------
 *
 * No index.ts:
 *   const core = new Core();
 *   new AuthApi(core).init();
 *
 * ----------------------------------------------------------------------------
 * COMO ALTERAR DADOS DO USUÁRIO (ATUALIZAÇÃO)
 * ----------------------------------------------------------------------------
 *
 * Esta API NÃO possui endpoint de atualização no momento.
 * Para alterar dados, você tem duas opções:
 *
 * 1) Atualização direta no banco (uso interno):
 *    Use um UPDATE na tabela "users".
 *
 *    Exemplo SQL:
 *      UPDATE "users"
 *      SET "name" = ?, "username" = ?, "email" = ?, "role" = ?,
 *          "password_hash" = ?, "updated" = CURRENT_TIMESTAMP
 *      WHERE "id" = ?;
 *
 *    Observações:
 *      - "username" e "email" são UNIQUE (podem falhar se já existir).
 *      - "role" deve ser "user", "editor" ou "admin".
 *
 * 2) Criar um endpoint de atualização:
 *    - Crie um handler (ex: patchUser)
 *    - Registre uma rota (ex: PATCH /auth/user/:id)
 *    - Execute o UPDATE usando this.db.prepare().run(...)
 *
 * A tabela "users" está definida em ./tables.ts.
 */
