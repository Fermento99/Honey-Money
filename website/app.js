const express = require("express");
app = express();
const port = 3000;

const options = {

}

app.use(express.static("static", options));

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

app.listen(port, () => console.log("listening on port " + port));