const router = require("express").Router();
const passport = require('passport');
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");
const productsController = require("../controllers/products.controller");
const charactersController = require("../controllers/characters.controller");
const authMiddlewares = require("../middlewares/authMiddleware");

const SCOPES = [
  "profile",
  "email"
]

// MISC
router.get("/", miscController.home);

// AUTH
router.get("/register", authController.register);
router.post("/register", authController.doRegister);
router.get("/login", authMiddlewares.isNotAuthenticated, authController.login);
router.post("/login", authController.doLogin);
router.get('/login/google', passport.authenticate('google-auth', { scope: SCOPES  }))
router.get('/auth/google/callback', authController.doLoginGoogle)
router.get("/logout", authController.logout);

// USERS
router.get("/profile", authMiddlewares.isAuthenticated, usersController.profile);

// PRODUCTS
router.get("/products/store", authMiddlewares.isAuthenticated, productsController.list);
router.get("/products/create", authMiddlewares.isAuthenticated, productsController.create);
router.post("/products/create", authMiddlewares.isAuthenticated, productsController.doCreate);
router.get("/products/:id", authMiddlewares.isAuthenticated, productsController.details);
router.delete("/products/:id", authMiddlewares.isAuthenticated, productsController.delete);

// CHARACTERS
router.get("/characters/list", authMiddlewares.isAuthenticated, charactersController.list);
router.get("/characters/:id", authMiddlewares.isAuthenticated, charactersController.details);

module.exports = router;