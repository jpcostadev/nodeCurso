/*
 * ============================================================================
 * SQL DE CRIAÇÃO DE TABELAS E VIEWS DO LMS
 * ============================================================================
 *
 * Este arquivo contém todo o SQL necessário para criar a estrutura do banco
 * de dados do LMS (Learning Management System).
 *
 * ----------------------------------------------------------------------------
 * TABELAS CRIADAS
 * ----------------------------------------------------------------------------
 *
 * courses - Armazena os cursos
 * lessons - Armazena as aulas de cada curso
 * lessons_completed - Registra quais aulas cada usuário completou
 * certificates - Armazena os certificados de conclusão de curso
 *
 * ----------------------------------------------------------------------------
 * VIEWS CRIADAS
 * ----------------------------------------------------------------------------
 *
 * lessons_completed_full - View com informações completas de aulas completadas
 * certificates_full - View com informações completas de certificados
 * lesson_nav - View para navegação entre aulas (prev/next)
 *
 * ----------------------------------------------------------------------------
 * ÍNDICES CRIADOS
 * ----------------------------------------------------------------------------
 *
 * idx_lessons_order - Índice composto em (course_id, order) para otimizar
 *                     buscas ordenadas de aulas por curso
 */
export const lmsTable = /*sql*/ `
        /*
         * ============================================================================
         * TABELA courses - CURSOS
         * ============================================================================
         *
         * Armazena informações dos cursos disponíveis.
         * Campos:
         *   - id: Chave primária auto-increment
         *   - slug: Identificador único amigável (case-insensitive, único)
         *   - title: Título do curso
         *   - description: Descrição do curso
         *   - lessons: Número total de aulas
         *   - hours: Carga horária em horas
         *   - created: Data de criação (timestamp automático)
         */
        CREATE TABLE IF NOT EXISTS "courses" (
        "id" INTEGER PRIMARY KEY,
        "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "lessons" INTEGER NOT NULL,
        "hours" INTEGER NOT NULL,
        "created" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) STRICT;

        /*
         * ============================================================================
         * TABELA lessons - AULAS
         * ============================================================================
         *
         * Armazena as aulas de cada curso.
         * Campos:
         *   - id: Chave primária auto-increment
         *   - course_id: Chave estrangeira para courses (obrigatória)
         *   - slug: Identificador da aula (case-insensitive, único por curso)
         *   - title: Título da aula
         *   - seconds: Duração em segundos
         *   - video: URL do vídeo da aula
         *   - description: Descrição da aula
         *   - order: Ordem da aula no curso (para ordenação)
         *   - free: Se é gratuita (0 = paga, 1 = gratuita)
         *   - created: Data de criação (timestamp automático)
         * Constraints:
         *   - UNIQUE(course_id, slug): Uma aula não pode ter o mesmo slug no mesmo curso
         *   - FOREIGN KEY course_id: Referencia courses(id)
         */
        CREATE TABLE IF NOT EXISTS "lessons" (
        "id" INTEGER PRIMARY KEY,
        "course_id" INTEGER NOT NULL,
        "slug" TEXT NOT NULL COLLATE NOCASE,
        "title" TEXT NOT NULL,
        "seconds" INTEGER NOT NULL,
        "video" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        "free" INTEGER NOT NULL DEFAULT 0 CHECK ("free" IN (0,1)),
        "created" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("course_id") REFERENCES "courses" ("id"),
        UNIQUE("course_id", "slug")
        ) STRICT;

        /*
         * ============================================================================
         * ÍNDICE idx_lessons_order - OTIMIZAÇÃO DE BUSCAS
         * ============================================================================
         *
         * Índice composto em (course_id, order) para otimizar:
         * - Buscas de aulas ordenadas por curso
         * - Queries que filtram por curso e ordenam por ordem
         */
        CREATE INDEX IF NOT EXISTS "idx_lessons_order" ON "lessons" ("course_id", "order");

        /*
         * ============================================================================
         * TABELA lessons_completed - AULAS COMPLETADAS
         * ============================================================================
         *
         * Registra quais aulas cada usuário completou.
         * Campos:
         *   - user_id: ID do usuário (chave estrangeira para users)
         *   - course_id: ID do curso (chave estrangeira para courses)
         *   - lesson_id: ID da aula (chave estrangeira para lessons)
         *   - completed: Data de conclusão (timestamp automático)
         * Constraints:
         *   - PRIMARY KEY (user_id, course_id, lesson_id): Chave composta
         *   - WITHOUT ROWID: Otimização para tabelas com chave primária composta
         *   - FOREIGN KEY user_id: Referencia users(id) com CASCADE DELETE
         *   - FOREIGN KEY lesson_id: Referencia lessons(id)
         *   - FOREIGN KEY course_id: Referencia courses(id)
         */
        CREATE TABLE IF NOT EXISTS "lessons_completed" (
        "user_id" INTEGER NOT NULL,
        "course_id" INTEGER NOT NULL,
        "lesson_id" INTEGER NOT NULL,
        "completed" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("user_id", "course_id", "lesson_id"),
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id"),
        FOREIGN KEY ("course_id") REFERENCES "courses" ("id")
        ) WITHOUT ROWID, STRICT;

        /*
         * ============================================================================
         * TABELA certificates - CERTIFICADOS
         * ============================================================================
         *
         * Armazena os certificados de conclusão de curso dos usuários.
         * Campos:
         *   - id: ID único do certificado (gerado automaticamente com hex(randomblob(8)))
         *   - user_id: ID do usuário (chave estrangeira para users)
         *   - course_id: ID do curso (chave estrangeira para courses)
         *   - completed: Data de conclusão (timestamp automático)
         * Constraints:
         *   - UNIQUE (user_id, course_id): Um usuário só pode ter um certificado por curso
         *   - WITHOUT ROWID: Otimização para tabelas com chave primária composta
         *   - FOREIGN KEY user_id: Referencia users(id) com CASCADE DELETE
         *   - FOREIGN KEY course_id: Referencia courses(id)
         */
        CREATE TABLE IF NOT EXISTS "certificates" (
        "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
        "user_id" INTEGER NOT NULL,
        "course_id" INTEGER NOT NULL,
        "completed" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("user_id", "course_id"),
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("course_id") REFERENCES "courses" ("id")
        ) WITHOUT ROWID, STRICT;

        /*
         * ============================================================================
         * VIEW lessons_completed_full - AULAS COMPLETADAS COM INFORMAÇÕES COMPLETAS
         * ============================================================================
         *
         * View que retorna informações completas sobre aulas completadas,
         * incluindo dados do usuário, curso e aula.
         * Campos retornados:
         *   - id: ID do usuário
         *   - email: Email do usuário
         *   - course: Título do curso
         *   - lesson: Título da aula
         *   - completed: Data de conclusão
         */
        CREATE VIEW IF NOT EXISTS "lessons_completed_full" AS
        SELECT "u"."id", "u"."email", "c"."title" AS "course", "l"."title" AS "lesson", "lc"."completed"
        FROM "lessons_completed" AS "lc"
        JOIN "users" AS "u" ON "u"."id" = "lc"."user_id"
        JOIN "lessons" AS "l" ON "l"."id" = "lc"."lesson_id"
        JOIN "courses" AS "c" ON "c"."id" = "lc"."course_id";

        /*
         * ============================================================================
         * VIEW certificates_full - CERTIFICADOS COM INFORMAÇÕES COMPLETAS
         * ============================================================================
         *
         * View que retorna informações completas sobre certificados,
         * incluindo dados do usuário e do curso.
         * Campos retornados:
         *   - id: ID do certificado
         *   - user_id: ID do usuário
         *   - name: Nome do usuário
         *   - course_id: ID do curso
         *   - title: Título do curso
         *   - hours: Carga horária do curso
         *   - lessons: Número de aulas do curso
         *   - completed: Data de conclusão
         */
        CREATE VIEW IF NOT EXISTS "certificates_full" AS
        SELECT "cert"."id", "cert"."user_id", "u"."name",
            "cert"."course_id", "c"."title", "c"."hours",
            "c"."lessons", "cert"."completed"
        FROM "certificates" as "cert"
        JOIN "users" AS "u" ON "u"."id" = "cert"."user_id"
        JOIN "courses" AS "c" on "c"."id" = "cert"."course_id";

        /*
         * ============================================================================
         * VIEW lesson_nav - NAVEGAÇÃO ENTRE AULAS (PREV/NEXT)
         * ============================================================================
         *
         * View que retorna as aulas adjacentes (anterior, atual, próxima) para
         * cada aula, facilitando a navegação entre aulas.
         * Como funciona:
         *   - Para cada aula (cl), retorna ela mesma e as aulas com order
         *     entre (cl.order - 1) e (cl.order + 1)
         *   - Isso permite encontrar facilmente a aula anterior e próxima
         * Campos retornados:
         *   - current_slug: Slug da aula atual (cl.slug)
         *   - Todos os campos da tabela lessons (l.*) para as aulas adjacentes
         * Ordenação: Por order ASC
         */
        CREATE VIEW IF NOT EXISTS "lesson_nav" AS
        SELECT "cl"."slug" AS "current_slug", "l".*
        FROM "lessons" AS "cl"
        JOIN "lessons" AS "l" ON "l"."course_id" = "cl"."course_id" AND "l"."order"
        BETWEEN "cl"."order" - 1 AND "cl"."order" + 1
        ORDER BY "l"."order";

`;
