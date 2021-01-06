
let accessToken;
let user;
let error = document.getElementById('transfer-error')

function validateReciver(login) {
  if (login.length >= 3 && login.length <= 25 && !/\s/.test(login)) return true;
  error.innerText = "Invalid reciver";
  return false;
}

function validateTitle(title) { 
  if(title.length <= 50 && title.length >= 1) return true;
  error.innerText = "Invalid title";
  return false;
}

function validateValue(value) {
  if(parseInt(value) > 0 && /^\d+$/.test(value)) return true;
  error.innerText = "Invalid value";
  return false;
}


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
  .catch(err => location.href="http://localhost:3000/logout")

document.getElementById("transfer-button").addEventListener('click', () => {
  const reciverv = reciver.value;
  const titlev = title.value;
  const valuev = value.value;
  if (!validateReciver(reciverv) || !validateTitle(titlev) || !validateValue(valuev)) return;

  const data = { sender: user, reciver: reciverv, title: titlev, value: valuev };
  window.sessionStorage.setItem("transferData", JSON.stringify(data));

  location.href = "http://localhost:3000/transfer/confirm";
})