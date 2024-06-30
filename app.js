const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const passportInit = require("./passport/passportInit");
require("express-async-errors");
require("dotenv").config();
const aboutRouter = require("./routes/aboutRouter");
const contactRouter = require("./routes/contactRouter");
const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('base64');
const lessons = require('./routes/lessons'); // Import lessons routes


const app = express();

app.set("view engine", "ejs");

//Security Packages
app.use(helmet());

app.use(xss());

app.use(express.static("public"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Body parser
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser(process.env.SESSION_SECRET));

// CSRF Protection
let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}
const csrf_options = {
  protected_operations: ["PATCH"],
  protected_content_types: ["application/json"],
  development_mode: csrf_development_mode,
};
app.use(csrf(csrf_options));

// Session configuration
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

app.use(session(sessionParms));

// Passport initialization
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// Other middleware
app.use((req, res, next) => {
    const nonce = crypto.randomBytes(16).toString('base64');
  
    res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${nonce}'`);
  
    res.locals.nonce = nonce;
  
    next();
  });
  
  app.get('./routes/students', async (req, res) => {
    try {
      const students = await Student.find({ createdBy: req.user._id });
      res.render('students', { students });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
app.use(require("connect-flash")());
app.use(require("./middleware/storeLocals"));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));
app.use("/about", aboutRouter);
app.use("/contact", contactRouter);
app.use('/lessons', lessons);

//Secret word handling
const auth = require("./middleware/auth");

//Students routes handling
const studentsRouter = require("./routes/students");
app.use("/", auth, studentsRouter);

// Error handling
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
