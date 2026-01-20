import type { CustomRequest } from "../api/http/customRequest.ts";
import type { CustomResponse } from "../api/http/customResponse.ts";

type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

export class Router {
  routes: Record<string, Record<string, Handler>> = {
    GET: {},
    POST: {},
  };
  get(route: string, handler: Handler) {
    this.routes["GET"][route] = handler;
  }
  post(route: string, handler: Handler) {
    this.routes["POST"][route] = handler;
  }

  find(method: string, route: string) {
    return this.routes[method]?.[route] || null;
  }
}
