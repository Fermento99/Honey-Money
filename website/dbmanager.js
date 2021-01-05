require('dotenv').config()

const mysql = require("mysql");
const bcrypt = require("bcrypt");


const connect = () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'gucio',
    password: process.env.DATABASE_PASSWORD,
    database: 'HoneyMoney'
  })
}

function validateUser(login) {
  if(login.length < 3 || login.length > 25 || /\s/.test(login)) return true;
  return true;
}


function register(user, next) {
  const { login, password } = user;
  // validate

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  let connection = connect();
  connection.query('INSERT INTO users (username, pass) values (?, ?);', [login, hash], (err, res) => {
    if (err) {
      console.log(err);
      next(false);
    } else {
      console.log('ok');
      next(true);
    }
  });
  connection.end();
}

function login(user, next) {
  const { login, password } = user;
  if(!validateUser(login)) return next(false);

  let connection = connect();
  connection.query('SELECT id, pass FROM users WHERE username = ?', login, (err, res) => {
    if(err) {
      console.log(err);
      next(false);
    }
    else {
      if(res[0])
        if(bcrypt.compareSync(password, res[0].pass))
          next(res[0].id);
        else
          next(false);
      else
        next(false);
    }
  });
  connection.end();
}

function reset_pass(user, next) {
  const { login, password } = user;
  if(!validateUser(login)) return next(false);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  let connection = connect();
  connection.query('UPDATE users SET pass = ? WHERE username = ?', [hash, login], (err, res) => {
    if(err) {
      console.log(err);
      next(false);
    } else {
      console.log(res);
      next(true);
    }
  });
  connection.end();
}

module.exports.register = register;
module.exports.login = login;
module.exports.reset = reset_pass