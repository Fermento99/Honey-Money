
document.getElementById('login-button').addEventListener('click', () => {
  let pass = document.getElementById('password').value;
  let login = document.getElementById('login').value;
  data = { login: login, password: pass };
  console.log('fetch');
  fetch("http://192.168.89.111:3000/auth/login", {
    method: "POST",
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(res => {
    console.log('got response');
    if (res.status == '200') location.href = 'http://192.168.89.111:3000/main';
    else throw Error(res.status); 
  }).catch(err => {
    console.log(err);
    document.getElementById('login-error').innerText = 'Wrong username or password';
  });
})