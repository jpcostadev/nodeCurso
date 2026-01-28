/*
 * ============================================================================
 * CUSTOM RESPONSE (ESTUDO)
 * ============================================================================
 *
 * Adiciona helpers simples para status e JSON.
 */
export function customResponse(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };

  res.json = (value) => {
    try {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(value));
    } catch (error) {
      res.status(500).end("Ocorreu um erro foda! melhore isto!");
    }
  };

  return res;
}
