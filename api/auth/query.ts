import { Query } from "../../core/utils/abstract.ts";
import type { UserCreate, UserData } from "./typesAuth.ts";

/*
 * ============================================================================
 * QUERIES DE AUTENTICAÇÃO
 * ============================================================================
 *
 * Centraliza as operações SQL relacionadas a usuários.
 */
export class AuthQuery extends Query {
  insertUser({ name, username, email, role, password_hash }: UserCreate) {
    return this.db
      .query(
        /*sql*/ `
                INSERT OR IGNORE INTO "users" 
                ("name", "username", "email", "role", "password_hash")
                VALUES
                (?,?,?,?,?)
            `,
      )
      .run(name, username, email, role, password_hash);
  }
}
