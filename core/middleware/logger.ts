import type { Middleware } from "../router.ts";

export const logger: Middleware = (req, res) => {
  console.log("LOGGER EXECUTANDO!");
  console.log(`${req.method} ${req.pathname}`);
};
