
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
  .then(() => {
    fetch("http://localhost:3000/history/data", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }).then(res => res.json())
    .then(data => {
      let table = document.getElementById('history-table');
      data.forEach(element => {
        table.innerHTML += `<tr><th>${element.title}</th><th>${element.sender}</th><th>${element.reciver}</th><th>${element.value} <span class="coin"><img src="./imgs/bee-coin.svg" /><p>Bee-coins</p></span></th></tr>`
      });
    })
  })

document.getElementById('logout-button').addEventListener("click", () => {
  fetch("http://localhost:3000/auth/logout", {
    method: "DELETE",
  }).then(res => {
    if (res.status == 200) {
      location.href = 'http://localhost:3000/welcome';
    }
  })
})

