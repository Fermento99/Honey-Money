
fetch("http://localhost:3000/auth/refresh", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
      if(res.status != 200) location.href="http://localhost:3000/logout";
  })

let data = JSON.parse(window.sessionStorage.getItem('returnedTransferData'));
console.log(data);
document.getElementById('sender').innerText = data.sender;
document.getElementById('reciver').innerText = data.reciver;
document.getElementById('title').innerText = data.title;
document.getElementById('value').innerText = data.value;

window.sessionStorage.removeItem('returnedTransferData');
window.sessionStorage.removeItem('transferData');