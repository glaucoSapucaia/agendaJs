require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo").default;
const session = require("express-session");
const flash = require("connect-flash");
const csurf = require("csurf");
const {
  csrfErrorMiddleware,
  csrfMiddleware,
} = require("./src/middlewares/csrfMiddlewares");
const routes = require("./routes");
const app = express();
const helmet = require("helmet");

const sessionOpts = session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({
    mongoUrl: process.env.STRING_DB_CONNECTION,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  },
});

mongoose
  .connect(process.env.STRING_DB_CONNECTION)
  .then(() => {
    console.log("DB Connected!");
    app.emit("db_connected");
  })
  .catch((e) => {
    console.error(e);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");
app.use(helmet());
app.use(sessionOpts);
app.use(flash());
app.use(csurf());
app.use(csrfMiddleware);
app.use(csrfErrorMiddleware);
app.use(routes);

app.on("db_connected", () => {
  app.listen(3000, () => {
    console.log("Server on!");
    console.log("http://localhost:3000");
  });
});
