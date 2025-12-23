const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeController");
const contactController = require("./src/controllers/contactController");

route.get("/", homeController.homePageGet);
route.post("/", homeController.homePagePost);

route.get("/contact", contactController.contactPageGet);

module.exports = route;
