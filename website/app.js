require('dotenv').config()

const express = require("express");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app = express();
const port = 3000;

app.use(express.static("static"));
app.use(cookieParser())
app.use(express.json())

let refreshTokens = [];

let generateAccessToken = user => {
    return jwt.sign({user: user, isDate: Date.now()}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '15m'});
}


app.get('/', (req, res) => {
    res.redirect('/welcome');
})

app.get('/welcome', (req, res) => {
    let auth = req.headers.authentication;
    if(auth) console.log(auth);
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


app.post('/auth/login', (req, res) => {
    let user = req.body.login;
    let refreshToken = generateAccessToken(user);
    res.cookie("refresh_token", refreshToken, {httpOnly: true, maxAge: 900000, sameSite: true});
    refreshTokens.push(refreshToken);
    console.log(refreshTokens);
    res.sendStatus(200);
    // res.sendStatus('401')
});

app.delete('/auth/logout', (req, res) => {
    let t = req.cookies.token;
    if(t && refreshTokens.includes(t)) ;
});

app.post('/auth/refresh', (req, res) => {
    let t = req.cookies.refresh_token;
    if(!t) res.sendStatus(401);
    else if(!refreshTokens.includes(t)) res.sendStatus(403);
    else {
        jwt.verify(t, process.env.REFRESH_TOKEN_SECRET, (err, token) => {
            if(err) res.sendStatus(403);
            else {
                accessToken = generateAccessToken(token.user);
                res.json({username: token.user, token: accessToken});
            }
        })
    }
});


app.listen(port, () => console.log("listening on port " + port));