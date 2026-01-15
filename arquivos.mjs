// Esse import é nativo do node para gerenciar pastas, arquivos e afins
import fs from "node:fs/promises";

//Aqui a gente cria uma pasta!
try {
  await fs.mkdir("./produtos");
} catch {
  console.log("Essa pasta já existe");
}

//Aqui criamos um arquivo dentro de uma pasta e escrevemos algo dentro dele.!
try {
  await fs.writeFile(
    "./produtos/clientes/clientes.json",
    JSON.stringify({ nome: "João", idade: 19 }),
  );
} catch {
  console.log("Erro ao criar o arquivo!");
}

//Aqui criamos um arquivo dentro de uma pasta e escrevemos algo dentro dele.!
try {
  await fs.writeFile(
    "./produtos/notebook.json",
    JSON.stringify([
      {
        nome: "Notebook",
        preco: 10.5,
      },
      {
        nome: "Smartphone",
        preco: 1.399,
      },
    ]),
  );
} catch {
  console.log("Erro ao criar o arquivo!");
}

// Aqui lemos o arquivo que acabamos de criar.

try {
  const dados = await fs.readFile("./produtos/notebook.json", "utf-8");
  console.log(dados);
} catch {
  console.log("Erro ao ler o arquivo.");
}

//Aqui lemos os diretórios
try {
  const dir = await fs.readdir("./produtos", { recursive: true }); //recursive como true mostra os arquivos q estão dentro de subpastas tbm.
  // Aqui posso filtrar para mostrar apenas arquivos com uma extensão específica.
  console.log(dir); // normal lista tudo
  console.log(dir.filter((file) => file.endsWith(".json"))); // só json!
} catch {
  console.log("Erro ao ler diretório");
}
