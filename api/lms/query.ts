import { Query } from "../../core/utils/abstract.ts";
import type {
  CourseCreate,
  CourseData,
  LessonCreate,
  LessonData,
} from "./typesLms.ts";

export class LmsQuery extends Query {
  /*
   * ============================================================================
   * MÉTODO insertCourse() - INSERIR CURSO
   * ============================================================================
   *
   * Insere um novo curso no banco de dados.
   * Parâmetros: { slug, title, description, lessons, hours }
   * Retorna: Resultado da execução (com changes e lastInsertRowid)
   * Usa: INSERT OR IGNORE (não duplica se já existir)
   * Cache: Sim (usa .query() para cache automático)
   */
  insertCourse({ slug, title, description, lessons, hours }: CourseCreate) {
    return this.db
      .query(
        /*sql*/ `
        INSERT OR IGNORE INTO "courses" 
        ("slug", "title", "description", "lessons", "hours")
        VALUES (?,?,?,?,?) 
        `,
      )
      .run(slug, title, description, lessons, hours);
  }

  /*
   * ============================================================================
   * MÉTODO insertLesson() - INSERIR AULA
   * ============================================================================
   *
   * Insere uma nova aula associada a um curso.
   * Parâmetros: { courseSlug, slug, title, seconds, video, description, order, free }
   * Retorna: Resultado da execução (com changes e lastInsertRowid)
   * Usa: Subquery para buscar course_id pelo slug do curso
   * Cache: Sim (usa .query() para cache automático)
   */
  insertLesson({
    courseSlug,
    slug,
    title,
    seconds,
    video,
    description,
    order,
    free,
  }: LessonCreate) {
    return this.db
      .query(
        /*sql*/ `
            INSERT OR IGNORE INTO "lessons" 
            ("course_id", "slug", "title", "seconds",
               "video", "description", "order", "free" )
            VALUES ((SELECT "id" FROM "courses" WHERE "slug" = ?),?,?,?,?,?,?,?) 
            `,
      )
      .run(courseSlug, slug, title, seconds, video, description, order, free);
  }

  /*
   * ============================================================================
   * MÉTODO selectCourses() - BUSCAR TODOS OS CURSOS
   * ============================================================================
   *
   * Retorna uma lista com todos os cursos cadastrados.
   * Retorna: Array de CourseData[]
   * Ordena por: created ASC (mais antigos primeiro)
   * Limite: 100 cursos
   * Cache: Não (usa .prepare() sem cache)
   */
  selectCourses() {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT * FROM "courses" ORDER BY "created" ASC LIMIT 100
      `,
      )
      .all() as CourseData[];
  }

  /*
   * ============================================================================
   * MÉTODO selectCourse() - BUSCAR CURSO POR SLUG
   * ============================================================================
   *
   * Busca um curso específico pelo slug.
   * Parâmetros: slug (string) - identificador único do curso
   * Retorna: CourseData | undefined
   * Cache: Não (usa .prepare() sem cache)
   */
  selectCourse(slug: string) {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT * FROM "courses" WHERE "slug" = ?
      `,
      )
      .get(slug) as CourseData | undefined;
  }

  /*
   * ============================================================================
   * MÉTODO selectLessons() - BUSCAR TODAS AS AULAS DE UM CURSO
   * ============================================================================
   *
   * Retorna todas as aulas de um curso específico.
   * Parâmetros: courseSlug (string) - slug do curso
   * Retorna: Array de LessonData[] ordenadas por "order"
   * Ordena por: order ASC (ordem crescente)
   * Cache: Não (usa .prepare() sem cache)
   */
  selectLessons(courseSlug: string) {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT * FROM "lessons" WHERE "course_id" = (SELECT "id" FROM "courses" WHERE "slug" = ? )
        ORDER BY "order" ASC
      `,
      )
      .all(courseSlug) as LessonData[];
  }

  /*
   * ============================================================================
   * MÉTODO selectLesson() - BUSCAR AULA POR SLUG
   * ============================================================================
   *
   * Busca uma aula específica de um curso.
   * Parâmetros: courseSlug (string), lessonSlug (string)
   * Retorna: LessonData | undefined
   * Cache: Não (usa .prepare() sem cache)
   */
  selectLesson(courseSlug: string, lessonSlug: string) {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT * FROM "lessons" WHERE "course_id" = (SELECT "id" FROM "courses" WHERE "slug" = ? ) AND "slug" = ?
      `,
      )
      .get(courseSlug, lessonSlug) as LessonData | undefined;
  }

  /*
   * ============================================================================
   * MÉTODO selectLessonNav() - BUSCAR NAVEGAÇÃO DE AULAS
   * ============================================================================
   *
   * Busca as aulas adjacentes (prev, current, next) usando a view lesson_nav.
   * Parâmetros: courseSlug (string), lessonSlug (string) - slug da aula atual
   * Retorna: Array de { slug: string }[] ordenadas por "order"
   * Usa: View lesson_nav que retorna aulas com order entre (current - 1) e (current + 1)
   * Cache: Não (usa .prepare() sem cache)
   */
  selectLessonNav(courseSlug: string, lessonSlug: string) {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT "slug" FROM "lesson_nav" WHERE "current_slug" = ?
        ORDER BY "order" ASC
      `,
      )
      .all(lessonSlug) as { slug: string }[];
  }

  /*
   * ============================================================================
   * MÉTODO insertLessonCompleted() - MARCAR AULA COMO COMPLETA
   * ============================================================================
   *
   * Registra que um usuário completou uma aula específica.
   * Parâmetros: userId (number), courseId (number), lessonId (number)
   * Retorna: Resultado da execução (com changes e lastInsertRowid)
   * Usa: INSERT OR IGNORE (não duplica se já estiver completa)
   * Cache: Não (usa .prepare() sem cache)
   */
  insertLessonCompleted(userId: number, courseId: number, lessonId: number) {
    return this.db
      .prepare(
        /*sql*/ `
        INSERT OR IGNORE INTO "lessons_completed" 
        ("user_id", "course_id", "lesson_id") 
        VALUES (?,?,?)
      `,
      )
      .run(userId, courseId, lessonId);
  }
  selectLessonCompleted(userId: number, lessonId: number) {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT "completed" FROM "lessons_completed" WHERE "user_id" = ? AND "lesson_id" = ?
        VALUES (?,?)
      `,
      )
      .get(userId, lessonId) as { completed: string } | undefined;
  }
  selectLessonsCompleted(userId: number, courseId: number) {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT "lesson_id", "completed" FROM "lessons_completed" WHERE "user_id" = ? AND "course_id" = ?
        VALUES (?,?)
      `,
      )
      .all(userId, courseId) as { lesson_id: number; completed: string } | [];
  }
  deleteLessonCompleted(userId: number, courseId: number) {
    return this.db
      .prepare(
        /*sql*/ `
        DELETE FROM "lessons_completed" WHERE  "user_id" = ? AND "course_id" = ?
      `,
      )
      .run(userId, courseId);
  }
}

/*
 * ============================================================================
 * CLASSE LmsQuery - QUERIES SQL PARA LMS
 * ============================================================================
 *
 * Esta classe organiza todas as queries SQL relacionadas ao LMS.
 * Estende a classe Query e demonstra como separar a lógica de queries
 * da lógica de rotas/handlers.
 *
 * ----------------------------------------------------------------------------
 * MÉTODOS DISPONÍVEIS
 * ----------------------------------------------------------------------------
 *
 * insertCourse() - Insere um novo curso no banco
 *   Parâmetros: { slug, title, description, lessons, hours }
 *   Retorna: Resultado da execução (com changes e lastInsertRowid)
 *   Usa: INSERT OR IGNORE (não duplica se já existir)
 *
 * insertLesson() - Insere uma nova aula no banco
 *   Parâmetros: { courseSlug, slug, title, seconds, video, description, order, free }
 *   Retorna: Resultado da execução (com changes e lastInsertRowid)
 *   Usa: Subquery para buscar course_id pelo slug
 *
 * selectCourses() - Busca todos os cursos
 *   Retorna: Array de CourseData[]
 *   Ordena por: created ASC
 *   Limite: 100 cursos
 *   Usa: .prepare() e .all() (sem cache, pois pode variar)
 *
 * selectCourse() - Busca um curso pelo slug
 *   Parâmetros: slug (string)
 *   Retorna: CourseData | undefined
 *   Usa: .prepare() e .get() (sem cache, pois pode variar)
 *
 * ----------------------------------------------------------------------------
 * DIFERENÇA ENTRE query() E prepare()
 * ----------------------------------------------------------------------------
 *
 * query() - Prepara e cacheia a query (mais rápido para queries repetidas)
 *   Use quando: A mesma query será executada várias vezes
 *   Exemplo: this.db.query(`SELECT * FROM ...`).get(param)
 *
 * prepare() - Prepara sem cache (mais flexível)
 *   Use quando: A query pode variar ou é executada poucas vezes
 *   Exemplo: this.db.prepare(`SELECT * FROM ...`).all()
 *
 * ----------------------------------------------------------------------------
 * COMO USAR
 * ----------------------------------------------------------------------------
 *
 * Na sua API:
 *   export class LmshApi extends Api {
 *     query = new LmsQuery(this.db);
 *
 *     handlers = {
 *       criarCurso: (req, res) => {
 *         const resultado = this.query.insertCourse(req.body);
 *         res.json({ id: resultado.lastInsertRowid });
 *       }
 *     };
 *   }
 */
