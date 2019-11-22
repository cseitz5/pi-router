log.success("|[LOADING ROUTER]| ");
var app = express();
module.exports = app;

// Sendgrid Subscribing
/*require("./modules/sendgrid.js");
app.post("/email/subscribe", (req, res) => {
  sendgridSubscribe(req.body.email);
})*/




var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const loginpage = fs.readFileSync(__dirname + "/login.html");
const session = require("express-session");

app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log(username, password);
    if (password == "test") {
      console.log("pls");
      return done(null, {
        auth: true,
      });
    } else {
      return done(null, false);
    }
  }
));
passport.serializeUser(function(user, done) {
  done(null, 1);
});

passport.deserializeUser(function(id, done) {
  done(null, {
    auth: true,
  })
});
declare("vue_auth", (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));
app.get("/login", (req, res) => {
  res.contentType("text/html");
  res.send(loginpage);
})


var api = express();
api.use(express.json());
app.use("/api", api);
