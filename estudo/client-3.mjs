const base = "http://localhost:3000";

await fetch(base + "/cursos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    slug: "html",
    nome: "HTML",
    descricao: "Curso de HTML",
  }),
});

await fetch(base + "/aulas", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    slug: "variaveis",
    nome: "Variáveis",
    cursoSlug: "javascript",
  }),
});

const cursos = await fetch(base + "/cursos").then((r) => r.json());

// console.log(cursos);

const curso = await fetch(base + "/curso?slug=html").then((r) => r.json());

// console.log(curso);

const aulas = await fetch(base + "/aulas?curso=html").then((r) => r.json());

// console.log(aulas);

const aula = await fetch(base + "/aula?curso=html&slug=semantica").then((r) =>
  r.json(),
);

console.log(aula);
