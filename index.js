const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit-name", (req, res) => {
  userName = req.body.name;
  res.redirect("/sign");
});

app.get("/sign", (req, res) => {
  res.render("sign", { userName });
});

app.post("/submit-sign", (req, res) => {
  userSignature = req.body.signature;
  res.redirect("/invitation");
});

app.get("/invitation", (req, res) => {
  res.render("invitation", { userName, userSignature });
});
app.get("/record", (req, res) => {
  res.render("record", { userName, userSignature });
});

app.listen(port, () => {
  console.log('Server running at : http://localhost:3000/');
  console.log("Ctrl+C to exit");
});