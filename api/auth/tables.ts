/*
 * ============================================================================
 * SQL DE TABELAS DE AUTENTICAÇÃO
 * ============================================================================
 *
 * Define a estrutura da tabela "users".
 *
 * Observação sobre "updated":
 * - O valor padrão é CURRENT_TIMESTAMP na criação.
 * - Para refletir alterações, atualize esse campo manualmente no UPDATE.
 */
export const authTables = /*sql*/ `
        CREATE TABLE IF NOT EXISTS "users" (
        "id" INTEGER PRIMARY KEY,
        "name" TEXT NOT NULL,
        "username" TEXT NOT NULL COLLATE NOCASE UNIQUE,
        "email" TEXT NOT NULL COLLATE NOCASE UNIQUE,
        "role" TEXT NOT NULL CHECK (role IN ('user', 'editor', 'admin')),
        "password_hash" TEXT NOT NULL,
        "created" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) STRICT;
`;
