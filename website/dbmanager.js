require('dotenv').config()

const mysql = require("mysql");
const bcrypt = require("bcrypt");


const connect = () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'gucio',
    password: process.env.DATABASE_PASSWORD,
    database: 'HoneyMoney',
    multipleStatements: true,
  })
}

function validateUser(login) {
  if(login.length < 3 || login.length > 25 || /\s/.test(login)) return true;
  return true;
}

function validateTitle(title) { return true; }
function validateValue(value) { return true; }


function register(user, next) {
  const { login, password } = user;
  if(!validateUser(login)) return next(false);

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  let connection = connect();
  connection.beginTransaction(err => {
    if(err) connection.rollback(() => {
      console.log(err);
      next(false);
    });
    connection.query('INSERT INTO users (username, pass) VALUES (?, ?);', [login, hash], (err, res) => {
      if(err) connection.rollback(() => {
        console.log(err);
        next(false);
      });
      console.log(res);
      const id = res.insertId;
      
      if(!id) connection.rollback(() => {
        console.log(err);
        next(false);
      });
      connection.query('INSERT INTO balances VALUES (?, 100);', [id], (err, res) => {
        if(err) connection.rollback(() => {
          console.log(err);
          next(false);
        });
        connection.commit(err => {
          if(err) connection.rollback(() => {
            console.log(err);
            next(false);
          });
          next(true);
        })
      });
    });
  });
}

function login(user, next) {
  const { login, password } = user;
  if(!validateUser(login)) return next(false);

  let connection = connect();
  connection.query('SELECT id, pass FROM users WHERE username = ?;', login, (err, res) => {
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
  connection.query('UPDATE users SET pass = ? WHERE username = ?;', [hash, login], (err, res) => {
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

function transfer(sender, reciver, title, value, next) {
  if(!validateUser(sender.username) || !validateUser(reciver) || !validateTitle(title) || !validateValue(value)) return next(false);


  let connection = connect();
  connection.beginTransaction(err => {
    if(err) connection.rollback(() => {
      console.log(err);
      next(false);
    });
    connection.query('SELECT id FROM users WHERE username = ?;', reciver, (err, res) => {
      if(err) connection.rollback(() => {
        console.log(err);
        next(false);
      });
      let reciverid = res[0].id;
      if(!reciverid) connection.rollback(err => {
        console.log(err);
        next(false);
      });

      connection.query('SELECT value FROM balances WHERE owner = ?;', sender.id, (err, res) => {
        if(err) connection.rollback(() => {
          console.log(err);
          next(false);
        });
        if(res[0].value < value) connection.rollback(() => {
          console.log(err);
          next(false);
        });
        let query = 'INSERT INTO transfers (sender, reciver, title, value) values (?, ?, ?, ?);';
        query += 'UPDATE balances SET value = value + ? WHERE owner = ?;';
        query += 'UPDATE balances SET value = value - ? where owner = ?;';

        connection.query(query, [sender.id, reciverid, title, value, /* */ value, reciverid,  /* */ value, sender.id], (err, res) => {
          if(err) connection.rollback(() => {
            console.log(err);
            next(false);
          });
          connection.commit(err => {
            if(err) connection.rollback(() => {
              console.log(err);
              next(false);
            });
            next(true);
          })
        })
      })
    })
  });
}

function history(user, next) {
  let connection = connect();
  connection.query('select t.title, s.username as sender, r.username as reciver, t.value from transfers as t cross join users as s on t.sender = s.id cross join users as r on t.reciver = r.id WHERE r.id = ? OR s.id = ? ', [user, user], (err, res) => {
    if(err) {
      console.log(err);
      return next(false);
    }
    next(res);
  });
  connection.end();
}

module.exports.register = register;
module.exports.login = login;
module.exports.reset = reset_pass;
module.exports.transfer = transfer;
module.exports.history = history;