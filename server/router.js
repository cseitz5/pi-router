log.success("|[LOADING ROUTER]| ");
var app = express();
module.exports = app;

// Sendgrid Subscribing
/*require("./modules/sendgrid.js");
app.post("/email/subscribe", (req, res) => {
  sendgridSubscribe(req.body.email);
})*/




const loginpage = fs.readFileSync(__dirname + "/login.html");
app.get("/login", (req, res) => {
  res.contentType("text/html");
  res.send(loginpage);
})
