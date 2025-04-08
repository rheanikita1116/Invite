const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Setup express-session middleware
app.use(session({
  secret: 'yourSecretKey123', // Change this to a strong secret in production
  resave: false,
  saveUninitialized: true
}));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit-name", (req, res) => {
  req.session.userName = req.body.name;
  res.redirect("/sign");
});

app.get("/sign", (req, res) => {
  res.render("sign");
});

app.post("/submit-sign", (req, res) => {
  req.session.userSignature = req.body.signature;
  res.redirect("/invitation");
});

app.get("/invitation", (req, res) => {
  const { userName, userSignature } = req.session;
  res.render("invitation", { userName, userSignature });
});

app.get("/record", (req, res) => {
  const { userName, userSignature } = req.session;
  res.render("record", { userName, userSignature });
});

app.listen(port, () => {
  console.log('Server running at : http://localhost:3000/');
  console.log("Ctrl+C to exit");
});
