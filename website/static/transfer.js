
let accessToken;
let user;

function validateReciver(r) { return true; }
function validateTitle(t) { return true; }
function validateValue(v) { return true; }


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

document.getElementById("transfer-button").addEventListener('click', () => {
  const reciverv = reciver.value;
  const titlev = title.value;
  const valuev = value.value;
  if (!validateReciver(reciverv) || !validateTitle(titlev) || !validateValue(valuev)) return;

  const data = { sender: user, reciver: reciverv, title: titlev, value: valuev };
  console.log(accessToken);

  fetch("http://localhost:3000/transfer", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data)
  })
})