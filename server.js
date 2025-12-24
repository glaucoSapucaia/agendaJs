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
const { globalMiddleware } = require("./src/middlewares/globalMiddleware");
const routes = require("./routes");
const app = express();
const helmet = require("helmet");

const isProduction = process.env.NODE_ENV === "production";
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
    secure: isProduction,
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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://code.jquery.com",
          "https://cdn.jsdelivr.net",
        ],

        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],

        fontSrc: ["'self'", "https://cdn.jsdelivr.net"],

        imgSrc: ["'self'", "data:"],

        connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  })
);

app.use(sessionOpts);
app.use(flash());
app.use(csurf());
app.use(csrfMiddleware);
app.use(csrfErrorMiddleware);
app.use(globalMiddleware);
app.use(routes);

app.on("db_connected", () => {
  app.listen(3000, () => {
    console.log("Server on!");
    console.log("http://localhost:3000");
  });
});
