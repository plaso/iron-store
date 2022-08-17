const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.register = (req, res, next) => {
  res.render("auth/register");
};

module.exports.doRegister = (req, res, next) => {
  const user = req.body;

  const renderWithErrors = (errors) => {
    res.render("auth/register", { errors, user });
  };

  User.findOne({ email: user.email })
    .then((userFound) => {
      if (userFound) {
        renderWithErrors("Email already exist");
      } else {
        return User.create(user).then((userCreated) => {
          res.redirect("/profile");
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors)
      } else {
        next(err)
      }
    });
};

module.exports.login = (req, res, next) => {
  res.render("auth/login");
};

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errors: "Invalid credentials." });
      } else if (user) {
        user.checkPassword(password).then((match) => {
          if (match) {
            req.session.currentUser = user;
            res.redirect("/profile");
          } else {
            res.render("auth/login", { errors: "Invalid credentials." });
          }
        });
      }
    })
    .catch((error) => next(error));
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
};