const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/authMiddleware");
const usersController = require("../controllers/users.controller");
const productsController = require("../controllers/products.controller");

// MISC
router.get("/", miscController.home);

// AUTH
router.get("/register", authController.register);
router.post("/register", authController.doRegister);
router.get("/login", authMiddlewares.isNotAuthenticated, authController.login);
router.post("/login", authController.doLogin);
router.get("/logout", authController.logout);

// USERS
router.get("/profile", authMiddlewares.isAuthenticated, usersController.profile);

// PRODUCTS
router.get("/products/store", authMiddlewares.isAuthenticated, productsController.list);
router.get("/products/create", authMiddlewares.isAuthenticated, productsController.create);
router.post("/products/create", authMiddlewares.isAuthenticated, productsController.doCreate);
router.get("/products/:id", authMiddlewares.isAuthenticated, productsController.details);

module.exports = router;