const response = await fetch("http://localhost:3000/produto/notebook", {
  method: "GET",
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // body: JSON.stringify({ username: "fallz", password: "123123" }),
});
const body = await response.text();
console.log(body);
