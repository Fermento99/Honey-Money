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


function register(user, response) {
  const { login, password } = user;
  // validate

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  let connection = connect();
  connection.query('INSERT INTO users (username, pass) values (?, ?);', [login, hash], (err, res) => {
    if (err) {
      console.log(err);
      response.sendStatus(400);
    } else {
      console.log('ok');
      response.sendStatus(200);
    }
  })
  connection.end();
};

function login(user, next) {
  const { login, password } = user;
  if(!validateUser(login)) return next(false);

  let connection = connect();
  connection.query('SELECT pass FROM users WHERE username = ?', login, (err, res) => {
    if(err) {
      console.log(err);
      next(false);
    }
    else {
      if(res[0])
        if(bcrypt.compareSync(password, res[0].pass))
          next(true);
        else
          next(false);
      else
        next(false);
    }
    connection.end();
  })
  
}

module.exports.register = register;
module.exports.login = login;