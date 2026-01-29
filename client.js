console.clear();

/*
 * ============================================================================
 * CLIENTE DE TESTE DA API
 * ============================================================================
 *
 * Este arquivo contém funções para testar a API do framework.
 * Use via linha de comando: node client.js <nomeDaFuncao>
 *
 * Exemplos:
 *   node client.js postCourse
 *   node client.js getCourses
 *   node client.js getLesson
 */

const base = "http://localhost:3000";

const functions = {
  /*
   * ============================================================================
   * FUNÇÃO postCourse() - CRIAR CURSO
   * ============================================================================
   *
   * Cria um novo curso no sistema.
   * Rota: POST /lms/course
   * Body: { slug, title, description, lessons, hours }
   * Retorna: { id, changes, title: "curso criado com sucesso" }
   */
  async postCourse() {
    const response = await fetch(base + "/lms/course", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        slug: "javascript-completo",
        title: "JavaScript Completo",
        description: "Curso completo de JavaScript",
        lessons: 80,
        hours: 20,
      }),
    });
    const body = await response.json();
    console.table(body);
  },
  /*
   * ============================================================================
   * FUNÇÃO postUser() - CRIAR USUÁRIO
   * ============================================================================
   *
   * Cria um novo usuário no sistema.
   * Rota: POST /auth/user
   * Body: { name, username, email, password }
   * Retorna: { title: "Usuário criado com sucesso" }
   * Nota: O role é definido automaticamente como "user"
   */
  async postUser() {
    const response = await fetch(base + "/auth/user", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "João Pedro",
        username: "fallz",
        email: "fallz.developer@gmail.com",
        password: "123123",
      }),
    });
    const body = await response.json();
    console.table(body);
  },

  /*
   * ============================================================================
   * FUNÇÃO postLessons(lesson) - CRIAR AULA
   * ============================================================================
   *
   * Cria uma nova aula associada a um curso.
   * Rota: POST /lms/lesson
   * Parâmetros: lesson (objeto com dados da aula)
   * Body: { courseSlug, slug, title, seconds, video, description, order, free }
   * Retorna: { id, changes, title: "aula criada" }
   *
   * Exemplo de uso:
   *   const lesson = {
   *     courseSlug: "javascript-completo",
   *     slug: "introducao",
   *     title: "Introdução ao JavaScript",
   *     seconds: 600,
   *     video: "https://...",
   *     description: "Primeira aula",
   *     order: 1,
   *     free: 1
   *   };
   *   await postLessons(lesson);
   */
  async postLessons(lesson) {
    const response = await fetch(base + "/lms/lesson", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(lesson),
    });
    const body = await response.json();
    console.table(body);
  },

  /*
   * ============================================================================
   * FUNÇÃO getCourses() - LISTAR TODOS OS CURSOS
   * ============================================================================
   *
   * Retorna uma lista com todos os cursos cadastrados.
   * Rota: GET /lms/courses
   * Retorna: Array de cursos ordenados por data de criação
   */
  async getCourses() {
    const response = await fetch(base + "/lms/courses", {
      method: "GET",
    });
    const body = await response.json();
    console.log(body);
  },

  /*
   * ============================================================================
   * FUNÇÃO getCourse() - BUSCAR CURSO POR SLUG
   * ============================================================================
   *
   * Busca um curso específico pelo slug e retorna com todas as suas aulas.
   * Rota: GET /lms/course/:slug
   * Parâmetros: slug na URL (hardcoded: "javascript-completo")
   * Retorna: { course: {...}, lessons: [...] }
   */
  async getCourse() {
    const response = await fetch(base + "/lms/course/html-e-css", {
      method: "GET",
    });
    const body = await response.json();
    console.log(body);
  },

  /*
   * ============================================================================
   * FUNÇÃO getLesson() - BUSCAR AULA POR SLUG
   * ============================================================================
   *
   * Busca uma aula específica e retorna com informações de navegação (prev/next).
   * Rota: GET /lms/lesson/:courseSlug/:lessonSlug
   * Parâmetros: courseSlug e lessonSlug na URL
   *            (hardcoded: "javascript-completo" / "funcoes-basico")
   * Retorna: { ...lesson, prev: slug | null, next: slug | null }
   */
  async getLesson() {
    const response = await fetch(base + "/lms/lesson/html-e-css/tags-basicas", {
      method: "GET",
    });
    const body = await response.json();
    console.log(body);
  },

  /*
   * ============================================================================
   * FUNÇÃO lessonComplete() - MARCAR AULA COMO COMPLETA
   * ============================================================================
   *
   * Marca uma aula como completa para o usuário.
   * Rota: POST /lms/lesson/complete
   * Body: { courseId, lessonId }
   * Retorna: { title: "Aula concluída" }
   * Nota: O userId é obtido do sistema de autenticação (hardcoded como 1 no servidor)
   */
  async lessonComplete() {
    const response = await fetch(base + "/lms/lesson/complete", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        courseId: process.argv[3],
        lessonId: process.argv[4],
      }),
    });
    const body = await response.json();
    console.log(body);
  },
  async resetCourse() {
    const response = await fetch(base + "/lms/course/reset", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        courseId: 1,
      }),
    });
    const body = await response.json();
    console.log(body);
  },

  async getCertificates() {
    const response = await fetch(base + "/lms/certificates", {
      method: "GET",
    });
    const body = await response.json();
    console.log(body);
  },
  async getCertificate() {
    const response = await fetch(base + "/lms/certificate/" + process.argv[3], {
      method: "GET",
    });
    const body = await response.json();
    console.log(body);
  },
};

/*
 * ============================================================================
 * EXECUÇÃO VIA LINHA DE COMANDO
 * ============================================================================
 *
 * Executa a função especificada como argumento.
 * Exemplo: node client.js postCourse
 */
if (process.argv[2]) {
  functions[process.argv[2]]();
}
