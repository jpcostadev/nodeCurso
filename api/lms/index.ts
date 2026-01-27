import { title } from "process";
import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/routeError.ts";
import { lmsTable } from "./lmsTable.ts";
import { LmsQuery } from "./query.ts";

export class LmshApi extends Api {
  query = new LmsQuery(this.db);
  handlers = {
    /*
     * ============================================================================
     * HANDLER postCourse - CRIAR CURSO
     * ============================================================================
     *
     * Cria um novo curso no banco de dados.
     * Rota: POST /lms/course
     * Body: { slug, title, description, lessons, hours }
     * Retorna: { id, changes, title: "curso criado com sucesso" }
     * Erro: 400 se não conseguir criar
     */
    postCourse: (req, res) => {
      const { slug, title, description, lessons, hours } = req.body;
      const writeResult = this.query.insertCourse({
        slug,
        title,
        description,
        lessons,
        hours,
      });
      if (writeResult.changes === 0) {
        throw new RouteError(400, "Erro ao criar curso");
      }
      res.status(200).json({
        id: writeResult.lastInsertRowid,
        changes: writeResult.changes,
        title: "curso criado com sucesso",
      });
    },

    /*
     * ============================================================================
     * HANDLER postLesson - CRIAR AULA
     * ============================================================================
     *
     * Cria uma nova aula associada a um curso.
     * Rota: POST /lms/lesson
     * Body: { courseSlug, slug, title, seconds, video, description, order, free }
     * Retorna: { id, changes, title: "aula criada" }
     * Erro: 400 se não conseguir criar
     */
    postLesson: (req, res) => {
      const {
        courseSlug,
        slug,
        title,
        seconds,
        video,
        description,
        order,
        free,
      } = req.body;
      const writeResult = this.query.insertLesson({
        courseSlug,
        slug,
        title,
        seconds,
        video,
        description,
        order,
        free,
      });

      if (writeResult.changes === 0) {
        throw new RouteError(400, "Erro ao criar aula");
      }
      res.status(200).json({
        id: writeResult.lastInsertRowid,
        changes: writeResult.changes,
        title: "aula criada",
      });
    },

    /*
     * ============================================================================
     * HANDLER getCourses - LISTAR TODOS OS CURSOS
     * ============================================================================
     *
     * Retorna uma lista com todos os cursos cadastrados.
     * Rota: GET /lms/courses
     * Retorna: Array de cursos ordenados por data de criação
     * Erro: 404 se não houver cursos cadastrados
     */
    getCourses: (req, res) => {
      const courses = this.query.selectCourses();
      if (courses.length === 0) {
        throw new RouteError(404, "Nenhum curso encontrdo.");
      }
      res.status(200).json(courses);
    },

    /*
     * ============================================================================
     * HANDLER getCourse - BUSCAR CURSO POR SLUG
     * ============================================================================
     *
     * Busca um curso específico pelo slug e retorna com todas as suas aulas.
     * Rota: GET /lms/course/:slug
     * Parâmetros: slug (na URL)
     * Retorna: { course: {...}, lessons: [...] }
     * Erro: 404 se o curso não for encontrado
     */
    getCourse: (req, res) => {
      const { slug } = req.params;
      const course = this.query.selectCourse(slug);
      if (!course) {
        throw new RouteError(404, "Curso não encontrado.");
      }
      const userId = 1;
      let completed: { lesson_id: number; completed: string }[] = [];
      if (userId) {
        completed = this.query.selectLessonsCompleted(userId, course.id);
      }

      const lessons = this.query.selectLessons(slug);
      res.status(200).json({ course, lessons, completed });
    },

    /*
     * ============================================================================
     * HANDLER getLesson - BUSCAR AULA POR SLUG
     * ============================================================================
     *
     * Busca uma aula específica e retorna com informações de navegação (prev/next).
     * Rota: GET /lms/lesson/:courseSlug/:lessonSlug
     * Parâmetros: courseSlug, lessonSlug (na URL)
     * Retorna: { ...lesson, prev: slug | null, next: slug | null }
     * Erro: 404 se a aula não for encontrada
     */
    getLesson: (req, res) => {
      const { courseSlug, lessonSlug } = req.params;
      const lesson = this.query.selectLesson(courseSlug, lessonSlug);
      const nav = this.query.selectLessonNav(courseSlug, lessonSlug);

      if (!lesson) {
        throw new RouteError(404, "Aula não encontrada.");
      }

      const index = nav.findIndex((l) => l.slug === lesson.slug);
      const prev = index === 0 ? null : nav.at(index - 1)?.slug;
      const next = nav.at(index + 1)?.slug ?? null;

      const userId = 1;
      let completed = "";
      if (userId) {
        const lessonCompleteed = this.query.selectLessonCompleted(
          userId,
          lesson.id,
        );
        if (lessonCompleteed) {
          completed = lessonCompleteed.completed;
        }
      }

      res.status(200).json({ ...lesson, prev, next, completed });
    },

    /*
     * ============================================================================
     * HANDLER completeLesson - MARCAR AULA COMO COMPLETA
     * ============================================================================
     *
     * Registra que um usuário completou uma aula específica.
     * Rota: POST /lms/lesson/complete
     * Body: { courseId, lessonId }
     * Retorna: { title: "Aula concluída" }
     * Erro: 404 se não conseguir marcar como completa
     * Nota: userId está hardcoded como 1 (deve ser obtido da sessão/autenticação)
     */
    completeLesson: (req, res) => {
      try {
        const userId = 1; // TODO: Obter do sistema de autenticação/sessão
        const { courseId, lessonId } = req.body;
        const writeResult = this.query.insertLessonCompleted(
          userId,
          courseId,
          lessonId,
        );
        if (writeResult.changes === 0) {
          throw new RouteError(
            400,
            "Erro ao completar a aula. Aula já pode estar completa.",
          );
        }
        res.status(201).json({ title: "Aula concluída" });
      } catch (erro) {
        res.status(400).json({
          title: "Erro ao completar aula",
        });
      }
    },

    resetCourse: (req, res) => {
      const userId = 1;
      const { courseId } = req.body;
      const writeResult = this.query.deleteLessonCompleted(userId, courseId);
      if (writeResult.changes === 0) {
        throw new RouteError(400, "Erro ao resetar curso");
      }
      res.status(201).json("curso resetado");
    },
  } satisfies Api["handlers"];

  /*
   * ============================================================================
   * MÉTODO tables() - CRIAÇÃO DE TABELAS
   * ============================================================================
   *
   * Executa o SQL de criação de todas as tabelas do LMS.
   * Cria: courses, lessons, lessons_completed, certificates
   * Cria também views: lessons_completed_full, certificates_full, lesson_nav
   */
  tables() {
    this.db.exec(lmsTable);
  }

  /*
   * ============================================================================
   * MÉTODO routes() - REGISTRO DE ROTAS
   * ============================================================================
   *
   * Registra todas as rotas HTTP da API de LMS.
   * Cada rota está associada ao seu handler correspondente.
   */
  routes(): void {
    this.router.post("/lms/course", this.handlers.postCourse);
    this.router.post("/lms/lesson", this.handlers.postLesson);
    this.router.get("/lms/courses", this.handlers.getCourses);
    this.router.get("/lms/course/:slug", this.handlers.getCourse);
    this.router.delete("/lms/course/reset", this.handlers.resetCourse);
    this.router.get(
      "/lms/lesson/:courseSlug/:lessonSlug",
      this.handlers.getLesson,
    );
    this.router.post("/lms/lesson/complete", this.handlers.completeLesson);
  }
}

/*
 * ============================================================================
 * CLASSE LmshApi - API DE LMS (LEARNING MANAGEMENT SYSTEM)
 * ============================================================================
 *
 * Esta classe implementa uma API completa para gerenciar cursos e aulas.
 * É um exemplo avançado que demonstra o uso de:
 * - Classe Query para organizar queries SQL
 * - Handlers organizados
 * - Múltiplas rotas (GET e POST)
 * - Tratamento de erros com RouteError
 *
 * ----------------------------------------------------------------------------
 * ESTRUTURA
 * ----------------------------------------------------------------------------
 *
 * query - Instância de LmsQuery que organiza todas as queries SQL
 * handlers - Objeto com todos os handlers da API
 * tables() - Cria as tabelas do banco (courses, lessons, etc)
 * routes() - Registra todas as rotas HTTP
 *
 * ----------------------------------------------------------------------------
 * HANDLERS DISPONÍVEIS
 * ----------------------------------------------------------------------------
 *
 * postCourse - Cria um novo curso
 *   Rota: POST /lms/course
 *   Body: { slug, title, description, lessons, hours }
 *   Retorna: { id, changes, title: "curso criado com sucesso" }
 *
 * postLesson - Cria uma nova aula
 *   Rota: POST /lms/lesson
 *   Body: { courseSlug, slug, title, seconds, video, description, order, free }
 *   Retorna: { id, changes, title: "aula criada" }
 *
 * getCourses - Lista todos os cursos
 *   Rota: GET /lms/courses
 *   Retorna: Array de cursos ou erro 404 se não houver cursos
 *
 * getCourse - Busca um curso pelo slug
 *   Rota: GET /lms/course/:slug
 *   Parâmetros: slug (na URL)
 *   Retorna: Objeto do curso ou erro 404 se não encontrar
 *
 * ----------------------------------------------------------------------------
 * ROTAS REGISTRADAS
 * ----------------------------------------------------------------------------
 *
 * POST /lms/course - Criar curso
 * POST /lms/lesson - Criar aula
 * GET /lms/courses - Listar todos os cursos
 * GET /lms/course/:slug - Buscar curso por slug
 *
 * ----------------------------------------------------------------------------
 * COMO USAR
 * ----------------------------------------------------------------------------
 *
 * No index.ts:
 *   const core = new Core();
 *   new LmshApi(core).init();
 *   core.init();
 *
 * Isso vai:
 * 1. Criar todas as tabelas do LMS (courses, lessons, etc)
 * 2. Registrar todas as rotas
 * 3. Iniciar o servidor
 */
