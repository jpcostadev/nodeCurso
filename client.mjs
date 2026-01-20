console.log("CLIENT INICIOU");

const base = "http://localhost:3000";

setTimeout(async () => {
  console.log("VOU FAZER FETCH");

  try {
    const response = await fetch(base + "/");
    console.log("RESPOSTA:", response.ok, response.status);
  } catch (err) {
    console.error("ERRO NO FETCH:", err);
  }
}, 200);
