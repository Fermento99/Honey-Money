require('dotenv').config()

const express = require("express");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dbmanager = require('./dbmanager');
const { nextTick } = require('process');

app = express();
const port = 3000;

app.use(express.static("static"));
app.use(cookieParser())
app.use(express.json())

let refreshTokens = [];

let generateAccessToken = user => {
  return jwt.sign({ user: user, isDate: Date.now() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

let generateRefreshToken = user => {
  return jwt.sign({ user: user, isDate: Date.now() }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15m' });
}

let checkToken = token => {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
    if(err) {
      coneole.log(err);
      next(false);
    } else next(token.user)
  });
}


app.get('/', (req, res) => {
  res.redirect('/welcome');
})

app.get('/welcome', (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/static/login_page.html");
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + "/static/register_page.html");
})

app.get('/main', (req, res) => {
  res.sendFile(__dirname + "/static/main_page.html");
})

app.post('/register', (req, res) => {
  dbmanager.register(req.body, res);
})

app.get('/register_successful', (req, res) => {
  res.sendFile(__dirname + "/static/register_successful.html")
})


app.post('/auth/login', (req, res) => {
  dbmanager.login(req.body, success => {
    if (success) {
      let user = req.body.login;
      let refreshToken = generateRefreshToken(user);
      res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 900000, sameSite: true });
      refreshTokens.push(refreshToken);
      console.log('new login');
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
});

app.delete('/auth/logout', (req, res) => {
  let t = req.cookies.token;
  if(t && refreshTokens.includes(t)) {
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
        accessToken = generateAccessToken(token.user);
        res.cookie("refresh_token", t, { httpOnly: true, maxAge: 900000, sameSite: true });
        res.json({ username: token.user, token: accessToken });
      }
    })
  }
});


app.listen(port, () => console.log("listening on port " + port));