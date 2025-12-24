const Login = require("../models/UserModel");

exports.index = (req, res) => {
  return res.render("login");
};
exports.logout = (req, res) => {
  req.flash("sucess", `Volte logo ${req.session.user}!`);
  req.session.destroy();
  return res.redirect("/");
};
exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.verifyUserLogin();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(() => {
        return res.redirect(req.get("Referrer") || "/login");
      });
      return;
    }

    req.session.user = login.user;
    req.flash("success", login.success);
    return req.session.save(() => {
      res.redirect("/contacts");
    });
  } catch (e) {
    console.error(e);
    return res.render("404");
  }
};
