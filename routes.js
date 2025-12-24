const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const registerController = require("./src/controllers/registerController");
const contactsController = require("./src/controllers/contactController");
const authMiddlewares = require("./src/middlewares/authMiddlewares");

route.get("/", homeController.index);

route.get("/login", loginController.index);
route.post("/login", loginController.login);
route.get("/lougout", loginController.logout);

route.get("/register", registerController.index);
route.post("/register", registerController.register);

route.get(
  "/contacts",
  authMiddlewares.authMiddleware,
  contactsController.index
);
route.post(
  "/contacts",
  authMiddlewares.authMiddleware,
  contactsController.addContact
);
route.get(
  "/contacts/:id",
  authMiddlewares.authMiddleware,
  contactsController.editContact
);

module.exports = route;
