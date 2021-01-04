
function validate(username, pass, pass2) {
  if(pass != pass2) {
    document.getElementById('register-error').innerText = "Passwords are not the same!";
    return false;
  }
  if(username.length > 25) {
    document.getElementById('register-error').innerText = "Login is too long!";
    return false;
  }
  if(username.length  < 3) {
    document.getElementById('register-error').innerText = "Login is too short!";
    return false;
  }
  if(/\s/.test(username)) {
    document.getElementById('register-error').innerText = "Login contains illegal character (whitespace)!";
    return false;
  }
  if(pass.length > 30) {
    document.getElementById('register-error').innerText = "Password is too long!";
    return false;
  }
  if(pass.length  < 8) {
    document.getElementById('register-error').innerText = "Password is too short!";
    return false;
  }
  return true;
}

document.getElementById('register-button').addEventListener('click', () => {
  console.log('pressed');
  let pass = password.value;
  let username = login.value;
  let pass2 = passwordconf.value;
  if(!validate(username, pass, pass2)) return;
  data = { login: username, password: pass };
  console.log('fetch');
  fetch("http://localhost:3000/register", {
    method: "POST",
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(res => {
    console.log('got response');
    if (res.status == '200') location.href = 'http://localhost:3000/register_successful';
    else throw Error(res.status); 
  }).catch(err => {
    console.log(err);
    document.getElementById('register-error').innerText = 'User already exists';
  });
});