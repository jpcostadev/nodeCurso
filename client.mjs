const response = await fetch("http://localhost:3000/produtos", {
  method: "POST",
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // body: JSON.stringify({ username: "fallz", password: "123123" }),
});
const body = await response.json();
console.log(body);
