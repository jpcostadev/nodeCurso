//--------------------------------------------
// Type Query Criar curso
//--------------------------------------------
export type CourseData = {
  id: number;
  slug: string;
  title: string;
  description: string;
  lessons: number;
  hours: number;
  created: string;
};
export type CourseCreate = Omit<CourseData, "id" | "created">;

//--------------------------------------------
// Type Query Criar Aula
//--------------------------------------------
export type LessonData = {
  id: number;
  course_id: number;
  slug: string;
  title: string;
  seconds: number;
  video: string;
  description: string;
  order: number;
  free: number;
  created: string;
};
export type LessonCreate = Omit<LessonData, "course_id" | "id" | "created"> & {
  courseSlug: string;
};

/*
 * ============================================================================
 * TIPOS DO LMS (LEARNING MANAGEMENT SYSTEM)
 * ============================================================================
 *
 * Este arquivo define os tipos TypeScript usados na API de LMS.
 * Os tipos garantem type-safety e facilitam o desenvolvimento.
 *
 * ----------------------------------------------------------------------------
 * TIPOS DE CURSO
 * ----------------------------------------------------------------------------
 *
 * CourseData - Tipo completo de um curso (como vem do banco)
 *   - id: number - ID único do curso
 *   - slug: string - Identificador amigável (ex: "javascript-completo")
 *   - title: string - Título do curso
 *   - description: string - Descrição do curso
 *   - lessons: number - Número de aulas
 *   - hours: number - Carga horária em horas
 *   - created: string - Data de criação (ISO string)
 *
 * CourseCreate - Tipo para criar um curso (sem id e created)
 *   Usa Omit para remover campos que são gerados automaticamente
 *   Use este tipo ao criar um novo curso
 *
 * ----------------------------------------------------------------------------
 * TIPOS DE AULA
 * ----------------------------------------------------------------------------
 *
 * LessonData - Tipo completo de uma aula (como vem do banco)
 *   - id: number - ID único da aula
 *   - course_id: number - ID do curso (chave estrangeira)
 *   - slug: string - Identificador amigável da aula
 *   - title: string - Título da aula
 *   - seconds: number - Duração em segundos
 *   - video: string - URL do vídeo
 *   - description: string - Descrição da aula
 *   - order: number - Ordem da aula no curso
 *   - free: number - Se é gratuita (0 ou 1)
 *   - created: string - Data de criação (ISO string)
 *
 * LessonCreate - Tipo para criar uma aula
 *   Remove: course_id, id, created (gerados automaticamente)
 *   Adiciona: courseSlug (usa slug ao invés de course_id)
 *   Use este tipo ao criar uma nova aula
 *
 * ----------------------------------------------------------------------------
 * COMO USAR
 * ----------------------------------------------------------------------------
 *
 * // Ao criar um curso
 * const novoCurso: CourseCreate = {
 *   slug: "javascript-completo",
 *   title: "JavaScript Completo",
 *   description: "Curso completo de JavaScript",
 *   lessons: 80,
 *   hours: 20
 * };
 *
 * // Ao criar uma aula
 * const novaAula: LessonCreate = {
 *   courseSlug: "javascript-completo",
 *   slug: "introducao",
 *   title: "Introdução ao JavaScript",
 *   seconds: 600,
 *   video: "https://...",
 *   description: "Primeira aula",
 *   order: 1,
 *   free: 1
 * };
 *
 * // Ao receber dados do banco
 * const curso: CourseData = await buscarCurso();
 * const aula: LessonData = await buscarAula();
 */
