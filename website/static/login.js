
document.getElementById('login-button').addEventListener('click', () => {
  console.log('pressed');
  let pass = password.value;
  let username = login.value;
  data = { login: username, password: pass };
  if(username.length > 25) {
    document.getElementById('login-error').innerText = "Login is too long!";
    return;
  }
  if(username.length  < 3) {
    document.getElementById('login-error').innerText = "Login is too short!";
    return;
  }
  console.log('fetch');
  fetch("http://localhost:3000/auth/login", {
    method: "POST",
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(res => {
    console.log('got response');
    if (res.status == '200') location.href = 'http://localhost:3000/main';
    else throw Error(res.status); 
  }).catch(err => {
    console.log(err);
    document.getElementById('login-error').innerText = 'Wrong username or password';
  });
});