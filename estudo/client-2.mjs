/*
 * ============================================================================
 * CLIENTE DE TESTE (ESTUDO) - PRODUTOS
 * ============================================================================
 *
 * Script de testes para endpoints do server-2.mjs.
 */
const notebookResponse = await fetch(
  "http://localhost:3000/produto?categoria=eletronicos&slug=notebook",
  {
    method: "GET",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    // body: JSON.stringify({
    //   nome: "Notebook",
    //   slug: "notebook",
    //   categoria: "eletronicos",
    //   preco: 4000,
    // }),
  },
);

const produtosResp = await fetch("http://localhost:3000/produtos", {
  method: "GET",
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // body: JSON.stringify({
  //   nome: "Notebook",
  //   slug: "notebook",
  //   categoria: "eletronicos",
  //   preco: 4000,
  // }),
});
const produtos = await produtosResp.json();
console.log(produtos);

const response = await fetch("http://localhost:3000/produtos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nome: "Notebook",
    slug: "notebook",
    categoria: "eletronicos",
    preco: 4000,
  }),
});
// const body = await response.text();
// console.log(body);

await fetch("http://localhost:3000/produtos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nome: "Mesa",
    slug: "mesa",
    categoria: "moveis",
    preco: 4000,
  }),
});

await fetch("http://localhost:3000/produtos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nome: "Mouse",
    slug: "mouse",
    categoria: "eletronicos",
    preco: 200,
  }),
});
