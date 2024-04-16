const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap");

const passport = require("passport");
const userController = require("../controllers/users");

// SIGNUP FORM ROUTE

router.get("/signup", userController.RenderSignupForm);

// SIGNUP FORM ROUTE (HANDEL)

router.post("/signup", asyncWrap(userController.signUp));

// Login FORM ROUTE

router.get("/login", userController.RenderLoginForm);

// LOGIN FORM ROUTE (HANDEL)

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  asyncWrap(userController.Login)
);

// LOGOUT USER

router.get("/logout", userController.LogOut);

module.exports = router;
