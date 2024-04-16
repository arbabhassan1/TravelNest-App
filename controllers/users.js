const User = require("../models/user");

// Signup User

module.exports.signUp = async (req, res, next) => {
  try {
    let { name, username, email, password } = req.body;
    let newUser = new User({ name, username, email });
    let registeredUser = await User.register(newUser, password);
    req.flash("success", "Wellcome to TravelNest!");
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Render Login Form

module.exports.RenderLoginForm = (req, res) => {
  res.render("./users/login");
};

//Render Signup Form

module.exports.RenderSignupForm = (req, res) => {
  res.render("./users/signup");
};

module.exports.Login = async (req, res) => {
  let mesg = `Welcome Back ${req.user.name}!`;
  req.flash("success", mesg);
  res.redirect("/listings");
};

// Logout User

module.exports.LogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Successfuly LougOut!");
    res.redirect("/listings");
  });
};
