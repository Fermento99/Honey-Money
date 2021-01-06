
let accessToken;

fetch("http://localhost:3000/auth/refresh", {
  method: "POST",
  credentials: "same-origin",
  headers: {
    'Content-Type': 'application/json',
  },
}).then(res => res.json())
  .then(data => {
    console.log(data)
    accessToken = data.token;
    return data.username;
  })
  .then(username => document.getElementById('username').innerText = username)
  .catch(err => location.href="http://localhost:3000/logout")

document.getElementById('logout-button').addEventListener("click", () => {
  fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
  }).then(res => {
    if(res.status == 200) {
      location.href='http://localhost:3000/welcome';
    }
  })
})