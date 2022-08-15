const User = require("../models/User.model");
const mongoose = require("mongoose");
const passport = require('passport');

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

const login = (req, res, next, provider) => {
  passport.authenticate(provider || 'local-auth', (err, user, validations) => {
    if (err) {
      next(err)
    } else if(!user) {
      res.status(404).render('auth/login', { errors: validations.error })
    } else {
      req.login(user, (loginError) => {
        if (loginError) {
          next(loginError)
        } else {
          req.session.currentUser = user;
          res.redirect('/profile')
        }
      })
    }
  })(req, res, next)
}

module.exports.login = (req, res, next) => {
  res.render("auth/login");
};

module.exports.doLogin = (req, res, next) => {
  login(req, res, next)

  // const renderWithErrors = (errors) => {
  //   res.render("auth/login", { errors });
  // };

  // const { email, password } = req.body;

  // User.findOne({ email })
  //   .then((user) => {
  //     if (!user) {
  //       renderWithErrors("Invalid credentials.");
  //       return;
  //     } else if (user) {
  //       user.checkPassword(password).then((match) => {
  //         if (match) {
  //           req.session.currentUser = user;
  //           res.redirect("/profile");
  //         } else {
  //           renderWithErrors("Invalid credentials.");
  //         }
  //       });
  //     }
  //   })
  //   .catch((error) => next(error));
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
};