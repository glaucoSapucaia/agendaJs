const Register = require("../models/registerModel");

exports.index = (req, res) => {
  res.render("register");
};
exports.register = async (req, res) => {
  try {
    const register = new Register(req.body);
    await register.verifyUser();

    if (register.errors.length > 0) {
      req.flash("errors", register.errors);
      req.session.save(() => {
        return res.redirect(req.get("Referrer") || "/register");
      });
      return;
    }

    req.flash("success", register.success);
    return req.session.save(() => {
      res.redirect("/login");
    });
  } catch (e) {
    console.error(e);
    return res.render("404");
  }
};
