const base = "http://localhost:3000";

const response1 = await fetch(base + "/curso/html");
console.log(response1.ok, response1.status);
console.log(await response1.json());
