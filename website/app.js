const express = require("express");
app = express();
const port = 3000;

//TODO: implement auth
function auth(credentils) { 
    let {login, password} = credentils;
    if(login == "kubus" && password == "maslo")
        return true;
    else
        return false;
 } 

app.use(express.static("static"));

app.get('/', (req, res) => {
    res.redirect('/welcome');
})

app.get('/welcome', (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
})

app.get('/login', (req, res) => {
    if (Object.keys(req.query) == 0)
        res.sendFile(__dirname + "/static/login_page.html");
    else if (auth(req.query))
        res.sendFile(__dirname + "/static/main_page.html");
    else
        res.sendFile(__dirname + "/static/login_page_wrong.html");
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + "/static/register_page.html");
})

app.listen(port, () => console.log("listening on port " + port));