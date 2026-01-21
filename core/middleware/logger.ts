import type { Middleware } from "../router.ts";

export const logger: Middleware = (req, res) => {
  console.log("LOGGER EXECUTANDO!");
  console.log(`${req.method} ${req.pathname}`);
};

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo cria um middleware de log simples
 * Mostra no console todas as requisições que chegam no servidor
 *
 * ----------------------------------------------------------------------------
 * MIDDLEWARE logger - O QUE ELE FAZ?
 * ----------------------------------------------------------------------------
 * Loga informações sobre cada requisição:
 *   - Método HTTP (GET, POST, PUT, DELETE, etc)
 *   - Pathname (caminho da URL sem query string)
 *
 * Exemplo de output:
 *   LOGGER EXECUTANDO!
 *   GET /products/notebook
 *
 * ----------------------------------------------------------------------------
 * COMO USAR
 * ----------------------------------------------------------------------------
 * No index.ts, registre como middleware global:
 *   core.router.use([logger])
 *
 * Agora todas as requisições vão ser logadas no console
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * logger = middleware que loga todas as requisições
 * Registre com core.router.use([logger])
 * Mostra método HTTP e pathname no console
 */
