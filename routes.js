const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const registerController = require("./src/controllers/registerController");
const contactsController = require("./src/controllers/contactController");

route.get("/", homeController.index);

route.get("/login", loginController.index);
route.get("/lougout", loginController.logout);
route.post("/login", loginController.login);

route.get("/register", registerController.index);
route.post("/register", registerController.register);

route.get("/contacts", contactsController.index);

module.exports = route;
