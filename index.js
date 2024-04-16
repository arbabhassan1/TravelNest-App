if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const method_override = require("method-override");
// const data = require("./init_DB/demoData");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingsRouter = require("./Routes/listing");
const reviewsRouter = require("./Routes/review");
const usersRouter = require("./Routes/user");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const app = express();
const PORT_NO = 8484;
// const MONGO_URL = "mongodb://127.0.0.1:27017/travelnest";
// const MONGO_URL = "mongodb://127.0.0.1:27017/travelnest";

const dbURL = process.env.ATLAS_DB_URL;

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SESSION_SECRET_KEY,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error is in MONGO SESSION STORE");
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET_KEY,
  saveUninitialized: true,
  resave: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Public Directory

app.use(express.static(path.join(__dirname, "/public")));

// Session USE

app.use(session(sessionOptions));

// Flash USE

app.use(flash());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// EJS MATE Setup

app.engine("ejs", ejsMate);

// EJS Setup

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// JSON Setup

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method OverRide

app.use(method_override("_method"));

// Mongoose Connection

main()
  .then((res) => {
    console.log("Database is Connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});

// Listings Route

app.use("/listings", listingsRouter);

// Reviews Route

app.use("/listings/:id/reviews", reviewsRouter);
// Users Route

app.use("/", usersRouter);

// Home Route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Handel Middleware

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(PORT_NO, () => {
  console.log("Server is Live on Port NO: " + PORT_NO);
  console.log("Live Preview: " + "http://localhost:" + PORT_NO + "/listings");
});
