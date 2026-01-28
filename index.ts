import { ProductApi } from "./api/products/index.ts";
import { Core } from "./core/core.ts";
import { logger } from "./core/middleware/logger.ts";
import { AuthApi } from "./api/auth/index.ts";
import { LmshApi } from "./api/lms/index.ts";

const core = new Core();

core.router.use([logger]);

new AuthApi(core).init();
new LmshApi(core).init();

core.init();

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse é o arquivo principal (entry point) da aplicação!
 * É por aqui que tudo começa - configura o servidor e organiza as APIs
 *
 * ----------------------------------------------------------------------------
 * COMO FUNCIONA (PASSO A PASSO)
 * ----------------------------------------------------------------------------
 * 1. Cria o Core:
 *    const core = new Core()
 *    Isso cria:
 *    - Servidor HTTP
 *    - Router (sistema de rotas)
 *    - Database (banco SQLite)
 *    - Registra bodyJson como middleware global automaticamente
 *
 * 2. Registra middlewares globais (opcional):
 *    core.router.use([logger])
 *    Esses middlewares rodam em TODAS as rotas
 *
 * 3. Cria e inicializa APIs:
 *    new AuthApi(core).init()
 *    new LmshApi(core).init()
 *    Isso:
 *    - Cria as tabelas do banco (método tables())
 *    - Registra as rotas (método routes())
 *    - Organiza tudo de forma modular
 *
 * 4. Inicia o servidor:
 *    core.init()
 *    Agora o servidor escuta na porta 3000
 *
 * ----------------------------------------------------------------------------
 * ESTRUTURA DO FRAMEWORK
 * ----------------------------------------------------------------------------
 * O framework está organizado assim:
 *
 * core/ - Código principal do framework
 *   - core.ts - Classe Core (servidor + router + database)
 *   - router.ts - Sistema de rotas
 *   - database.ts - Wrapper do SQLite com cache de queries
 *   - http/ - Customizações de Request/Response
 *   - middleware/ - Middlewares prontos (bodyJson, logger)
 *   - utils/ - Utilitários (RouteError, Api abstract)
 *
 * api/ - Suas APIs organizadas por módulo
 *   - auth/ - API de autenticação
 *   - lms/ - API de cursos (LMS)
 *   - products/ - API de produtos (exemplo)
 *
 * ----------------------------------------------------------------------------
 * COMO CRIAR UMA NOVA API
 * ----------------------------------------------------------------------------
 * 1. Crie uma classe que estende Api:
 *    export class MinhaApi extends Api {
 *      handlers = {
 *        meuHandler: (req, res) => { ... }
 *      }
 *
 *      tables() {
 *        // Cria tabelas aqui
 *        this.core.db.exec(`CREATE TABLE ...`)
 *      }
 *
 *      routes() {
 *        // Registra rotas aqui
 *        this.core.router.get("/rota", this.handlers.meuHandler)
 *      }
 *    }
 *
 * 2. No index.ts, inicialize:
 *    new MinhaApi(core).init()
 *
 * ----------------------------------------------------------------------------
 * ROTAS ATUAIS (AuthApi + LmshApi)
 * ----------------------------------------------------------------------------
 * POST /auth/user
 *   Cria um usuário
 *
 * POST /lms/course
 *   Cria um curso
 *
 * POST /lms/lesson
 *   Cria uma aula
 *
 * GET /lms/courses
 *   Lista cursos
 *
 * GET /lms/course/:slug
 *   Detalha curso + aulas
 *
 * GET /lms/lesson/:courseSlug/:lessonSlug
 *   Detalha aula + navegação
 *
 * POST /lms/lesson/complete
 *   Marca aula como concluída
 *
 * DELETE /lms/course/reset
 *   Reseta progresso de um curso
 *
 * ----------------------------------------------------------------------------
 * MIDDLEWARES GLOBAIS
 * ----------------------------------------------------------------------------
 * bodyJson - Já registrado automaticamente no Core
 *   Lê o body JSON das requisições POST/PUT
 *
 * logger - Registrado manualmente
 *   Loga todas as requisições
 *
 * ----------------------------------------------------------------------------
 * TRATAMENTO DE ERROS
 * ----------------------------------------------------------------------------
 * O Core tem um try/catch que captura erros:
 * - Se for RouteError: retorna JSON com status e mensagem
 * - Se for outro erro: retorna 500 (erro interno)
 * - Todos os erros são logados no console
 *
 * Use assim nos handlers:
 *   throw new RouteError(404, "Não encontrado")
 *
 * ----------------------------------------------------------------------------
 * BANCO DE DADOS
 * ----------------------------------------------------------------------------
 * O Core já cria uma instância do Database
 * Acesse via: core.db
 *
 * Métodos úteis:
 *   - core.db.exec(sql) - Executa SQL direto
 *   - core.db.query(sql) - Prepara e cacheia uma query
 *   - core.db.prepare(sql) - Prepara uma query (sem cache)
 *
 * Exemplo:
 *   const product = core.db
 *     .query(`SELECT * FROM products WHERE slug = ?`)
 *     .get(slug)
 *
 * ----------------------------------------------------------------------------
 * RESUMO
 * ----------------------------------------------------------------------------
 * index.ts = ponto de entrada da aplicação
 * Core = servidor + router + database (criado automaticamente)
 * ProductApi = exemplo de como organizar uma API
 * Use Api abstract para criar novas APIs organizadas
 * Middlewares globais rodam em todas as rotas
 * RouteError para erros HTTP customizados
 */
