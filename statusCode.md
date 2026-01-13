# Códigos de Status HTTP

## Respostas Informativas (1xx)

- **100 Continue**: Cliente deve continuar a solicitação.
- **101 Switching Protocols**: Servidor mudando de protocolo.
- **102 Processing**: Requisição sendo processada, sem resposta ainda.
- **103 Early Hints**: Pré-carregamento de recursos enquanto prepara resposta.

## Respostas Bem-Sucedidas (2xx)

- **200 OK**: Solicitação bem-sucedida (depende do método).
- **201 Created**: Novo recurso criado.
- **202 Accepted**: Requisição aceita, mas não processada ainda.
- **203 Non-Authoritative Information**: Metadados de cópia local ou terceiros.
- **204 No Content**: Sem conteúdo, mas cabeçalhos úteis.
- **205 Reset Content**: Redefinir documento enviado.
- **206 Partial Content**: Parte do recurso retornada (Range).
- **207 Multi-Status**: Informações sobre múltiplos recursos.
- **208 Already Reported**: Evita repetição em ligações múltiplas.
- **226 IM Used**: Resposta com manipulações aplicadas.

## Redirecionamentos (3xx)

- **300 Multiple Choices**: Múltiplas opções disponíveis.
- **301 Moved Permanently**: URL mudou permanentemente.
- **302 Found**: URL mudou temporariamente.
- **303 See Other**: Obter recurso em outro URI via GET.
- **304 Not Modified**: Resposta não modificada (cache).
- **305 Use Proxy**: Usar proxy (obsoleto).
- **306 Unused**: Reservado, não usado.
- **307 Temporary Redirect**: Redirecionamento temporário, mesmo método.
- **308 Permanent Redirect**: Redirecionamento permanente, mesmo método.

## Erros do Cliente (4xx)

- **400 Bad Request**: Erro na solicitação do cliente.
- **401 Unauthorized**: Autenticação necessária.
- **402 Payment Required**: Pagamento exigido (experimental).
- **403 Forbidden**: Acesso negado (cliente conhecido).
- **404 Not Found**: Recurso não encontrado.
- **405 Method Not Allowed**: Método não suportado.
- **406 Not Acceptable**: Conteúdo não aceitável.
- **407 Proxy Authentication Required**: Autenticação no proxy.
- **408 Request Timeout**: Tempo esgotado.
- **409 Conflict**: Conflito com estado atual.
- **410 Gone**: Recurso removido permanentemente.
- **411 Length Required**: Content-Length obrigatório.
- **412 Precondition Failed**: Pré-condições não atendidas.
- **413 Payload Too Large**: Carga muito grande.
- **414 URI Too Long**: URI muito longa.
- **415 Unsupported Media Type**: Tipo de mídia não suportado.
- **416 Range Not Satisfiable**: Intervalo inválido.
- **417 Expectation Failed**: Expectativa não atendida.
- **418 I'm a Teapot**: Recusa humorística (não padrão).
- **421 Misdirected Request**: Servidor inapto.
- **422 Unprocessable Content**: Erros semânticos.
- **423 Locked**: Recurso bloqueado.
- **424 Failed Dependency**: Falha em dependência.
- **425 Too Early**: Risco de repetição.
- **426 Upgrade Required**: Atualização de protocolo necessária.
- **428 Precondition Required**: Pré-condição obrigatória.
- **429 Too Many Requests**: Limitação de frequência.
- **431 Request Header Fields Too Large**: Cabeçalhos muito grandes.
- **451 Unavailable For Legal Reasons**: Indisponível por razões legais.

## Erros do Servidor (5xx)

- **500 Internal Server Error**: Erro interno do servidor.
- **501 Not Implemented**: Método não implementado.
- **502 Bad Gateway**: Gateway recebeu resposta inválida.
- **503 Service Unavailable**: Serviço indisponível (manutenção, sobrecarga).
- **504 Gateway Timeout**: Gateway sem resposta a tempo.
- **505 HTTP Version Not Supported**: Versão HTTP não suportada.
- **506 Variant Also Negotiates**: Erro de configuração.
- **507 Insufficient Storage**: Armazenamento insuficiente.
- **508 Loop Detected**: Loop infinito detectado.
- **510 Not Extended**: Extensões necessárias.
- **511 Network Authentication Required**: Autenticação de rede necessária.
