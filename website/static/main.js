
let accessToken;

fetch("http://192.168.89.111:3000/auth/refresh", {
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