/*
 * ============================================================================
 * TIPOS DE AUTENTICAÇÃO
 * ============================================================================
 *
 * Tipos usados no cadastro de usuários.
 */
export type UserRole = "admin" | "editor" | "user";

export type UserData = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  password_hash: string;
  created: string;
  updated: string;
};
export type UserCreate = Omit<UserData, "id" | "created" | "updated">;
