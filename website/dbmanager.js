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


function register(user, response) {
    const {login, password} = user;
    // validate

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    let connection = connect();
    connection.query('INSERT INTO users (username, pass) values (?, ?);', [login, hash], (err, res) => {
        if(err){
            console.log(err);
            response.sendStatus(400);
        } else {
            console.log('ok');
            response.sendStatus(200);
        }
    })
    connection.end();
};

function login(user) {
    const {username, pass} = user;
}

module.exports.register = register;
module.exports.login = login;