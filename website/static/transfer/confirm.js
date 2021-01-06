
let accessToken;
let user;

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
    user = { id: data.id, username: data.username };
    return data.username;
  })
  .then(username => document.getElementById('username').innerText = username)
  .catch(err => location.href = "http://localhost:3000/logout")

let data = JSON.parse(window.sessionStorage.getItem('transferData'));
console.log(data);
document.getElementById('reciver').innerText = data.reciver;
document.getElementById('title').innerText = data.title;
document.getElementById('value').innerText = data.value;


document.getElementById("transfer-button").addEventListener('click', () => {
  fetch("http://localhost:3000/transfer", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: window.sessionStorage.getItem('transferData')
  }).then(res => {
    console.log(res);
    if (res.status != 200) return false;
    else return res.json();
  }).then(data => {
    if (data) {
      window.sessionStorage.setItem("returnedTransferData", JSON.stringify(data));
      location.href = 'http://localhost:3000/transfer/accepted';
    } else location.href = 'http://localhost:3000/transfer/denied';
  })
});