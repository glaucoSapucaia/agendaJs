const Contact = require("../models/contactModel");

exports.index = async (req, res) => {
  const contacts = await Contact.getAllContacts();

  res.render("contacts", {
    contact: {},
    contacts,
  });
};
exports.addContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.verifyContactRegister();

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => {
        return res.redirect(req.get("Referrer") || "/contacts");
      });
      return;
    }

    req.flash("success", contact.success);
    return req.session.save(() => {
      res.redirect(`/contacts/${contact.contact._id}`);
    });
  } catch (e) {
    console.error(e);
    return res.render("404");
  }
};
exports.editContact = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contact = await Contact.getContact(req.params.id);
    const contacts = await Contact.getAllContacts();

    if (!contact) return res.render("404");

    res.render("contacts", { contact, contacts });
  } catch (e) {
    console.error(e);
    return res.render("404");
  }
};
