require('dotenv').config()

const fs = require("fs");
const https = require("https");
const express = require("express");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dbmanager = require('./dbmanager');

app = express();
const port = 3000;

app.use(express.static("static"));
app.use(cookieParser())
app.use(express.json())

let refreshTokens = [];

let generateAccessToken = user => {
  return jwt.sign({ id: user.id, user: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

let generateRefreshToken = user => {
  return jwt.sign({ id: user.id, user: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15m' });
}

let checkToken = (token, next) => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
    if (err) {
      console.log(err);
      next(false);
    } else next(token)
  });
}


// loging pages
app.get('/', (req, res) => {
  res.redirect('/welcome');
})

app.get('/welcome', (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/static/login/login_page.html");
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + "/static/register/register_page.html");
})

app.post('/register', (req, res) => {
  dbmanager.register(req.body, success => {
    if (success) res.sendStatus(200);
    else res.sendStatus(400);
  });
})

app.get('/register_successful', (req, res) => {
  res.sendFile(__dirname + "/static/register/register_successful.html");
})

app.get('/forgotten_password', (req, res) => {
  res.sendFile(__dirname + "/static/forgotten/forgotten_password.html");
})

app.post('/forgotten_password', (req, res) => {
  dbmanager.reset(req.body, success => {
    if (success) res.sendStatus(200);
    else res.sendStatus(400);
  })
})

app.get('/pass_successful', (req, res) => {
  res.sendFile(__dirname + "/static/forgotten/pass_succesful.html");
})


// main pages
app.get('/main', (req, res) => {
  res.sendFile(__dirname + "/static/main/main_page.html");
})

app.get('/logout', (req, res) => {
  res.sendFile(__dirname + "/static/main/log_out.html")
})

app.get('/transfer', (req, res) => {
  res.sendFile(__dirname + "/static/transfer/transfer_page.html");
})

app.get('/transfer/confirm', (req, res) => {
  res.sendFile(__dirname + "/static/transfer/confirmation_page.html");
})

app.get('/transfer/accepted', (req, res) => {
  res.sendFile(__dirname + "/static/transfer/accepted_transfer.html");
})

app.get('/transfer/denied', (req, res) => {
  res.sendFile(__dirname + "/static/transfer/denied_transfer.html");
})

app.get('/history', (req, res) => {
  res.sendFile(__dirname + "/static/history/history_page.html");
})

app.get('/history/data', (req, res) => {
  const token = req.headers.authorization;
  checkToken(token.split(' ')[1], user => {
    if (user) {
      dbmanager.history(user.id, data => {
        if (data) res.json(data);
        else res.sendStatus(400);
      })
    } else res.sendStatus(401);
  });
})

app.get('/balance', (req, res) => {
  const token = req.headers.authorization;
  checkToken(token.split(' ')[1], user => {
    if (user) {
      dbmanager.balance(user.id, data => {
        if (data) res.json(data);
        else res.sendStatus(400);
      })
    } else res.sendStatus(401);
  });
})

app.post('/transfer', (req, res) => {
  const token = req.headers.authorization;
  const { sender, reciver, title, value } = req.body;
  console.log('transfer');
  if (!token) return res.sendStatus(401);
  checkToken(token.split(' ')[1], user => {
    if (user) {
      if (sender.id != user.id || sender.username != user.user) return res.sendStatus(401);
      dbmanager.transfer(sender, reciver, title, value, success => {
        if (success) return res.json({ sender: sender.username, reciver: reciver, title: title, value: value });
        else return res.sendStatus(400);
      })
    } else return res.sendStatus(401);
  });
})


// auth pages
app.post('/auth/login', (req, res) => {
  dbmanager.login(req.body, id => {
    if (id) {
      let user = { id: id, name: req.body.login };
      let refreshToken = generateRefreshToken(user);
      res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 900000, sameSite: true });
      refreshTokens.push(refreshToken);
      console.log('login');
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
});

app.delete('/auth/logout', (req, res) => {
  console.log('logout');
  let t = req.cookies.refresh_token;
  if (t && refreshTokens.includes(t)) {
    refreshTokens.splice(refreshTokens.indexOf(t));
    res.sendStatus(200);
  } else res.sendStatus(400);
});

app.post('/auth/refresh', (req, res) => {
  let t = req.cookies.refresh_token;
  if (!t) res.sendStatus(401);
  else if (!refreshTokens.includes(t)) res.sendStatus(403);
  else {
    jwt.verify(t, process.env.REFRESH_TOKEN_SECRET, (err, token) => {
      if (err) res.sendStatus(403);
      else {
        refreshTokens.splice(refreshTokens.indexOf(t));
        accessToken = generateAccessToken({ id: token.id, name: token.user });
        refreshToken = generateRefreshToken({ id: token.id, name: token.user });
        refreshTokens.push(refreshToken);
        res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 900000, sameSite: true });
        res.json({ id: token.id, username: token.user, token: accessToken });
      }
    })
  }
});


// server setup 

const privkey  = fs.readFileSync('../certificates/honeykey.pem', 'utf8');
const privcert  = fs.readFileSync('../certificates/honeycert.crt', 'utf8');
const credentials = {key: privkey, cert: privcert};

https.createServer(credentials, app).listen(port, () => console.log("listening on port " + port));