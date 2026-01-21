import { ServerResponse } from "node:http";

// Interface CustomResponse
export interface CustomResponse extends ServerResponse {
  status(code: number): CustomResponse;
  json(data: any): void;
}

// Função customResponse
export function customResponse(response: ServerResponse) {
  const res = response as CustomResponse;
  
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };

  res.json = (data: any) => {
    try {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    } catch (error) {
      res.status(500).end("Ocorreu um erro com o response.");
    }
  };

  return res;
}

/*
 * ============================================================================
 * O QUE ESSE ARQUIVO FAZ?
 * ============================================================================
 *
 * Esse arquivo pega a resposta HTTP do Node.js (que é meio chata de usar)
 * e adiciona métodos mais fáceis pra você enviar respostas
 *
 * ----------------------------------------------------------------------------
 * INTERFACE CustomResponse - O QUE TEM DENTRO?
 * ----------------------------------------------------------------------------
 * Adiciona dois métodos super úteis:
 *
 * status(code) - Define o código de status (200 = ok, 404 = não encontrado, etc)
 *   Retorna a própria resposta pra você poder encadear: res.status(200).json(...)
 *
 * json(data) - Envia uma resposta JSON automaticamente
 *   Você só passa o objeto/array e ele já converte e envia
 *
 * ----------------------------------------------------------------------------
 * FUNÇÃO customResponse() - O QUE ELA FAZ?
 * ----------------------------------------------------------------------------
 * Pega a resposta do Node.js e adiciona os métodos status() e json()
 * Agora você pode usar de forma mais fácil
 *
 * ----------------------------------------------------------------------------
 * MÉTODO status(code) - Definir código de status
 * ----------------------------------------------------------------------------
 * Define qual código HTTP você quer enviar:
 *   - 200 = Tudo certo
 *   - 404 = Não encontrado
 *   - 500 = Erro no servidor
 *   - etc...
 *
 * Retorna a própria resposta pra você poder fazer:
 *   res.status(200).json({})  <- encadeia os métodos
 *
 * ----------------------------------------------------------------------------
 * MÉTODO json(data) - Enviar resposta JSON
 * ----------------------------------------------------------------------------
 * Envia uma resposta JSON de forma automática
 *
 * O que ele faz:
 *   1. Define o header "Content-Type" como "application/json"
 *      (pra o navegador saber que é JSON)
 *
 *   2. Converte seu objeto/array pra string JSON
 *      Tipo: { message: "oi" } vira '{"message":"oi"}'
 *
 *   3. Envia a resposta
 *
 * Se der erro (tipo objeto circular), retorna erro 500
 *
 * ----------------------------------------------------------------------------
 * EXEMPLOS DE USO
 * ----------------------------------------------------------------------------
 * // Enviar JSON com sucesso
 * res.status(200).json({ message: "Deu certo!", data: [...] })
 *
 * // Enviar erro
 * res.status(404).json({ error: "Não encontrado" })
 *
 * // Ou separado
 * res.status(200)
 * res.json({ message: "Ok" })
 *
 * ----------------------------------------------------------------------------
 * RESUMO SIMPLES
 * ----------------------------------------------------------------------------
 * customResponse = adiciona métodos fáceis pra enviar respostas
 * status() = define código HTTP (200, 404, etc)
 * json() = envia JSON automaticamente
 * Você pode usar: res.status(200).json({ message: "oi" })
 */
