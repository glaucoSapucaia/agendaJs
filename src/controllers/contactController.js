const Contact = require("../models/ContactModel");

exports.index = async (req, res) => {
  const contacts = await Contact.getAllContacts();

  res.render("contacts", {
    contact: {},
    contacts,
    isEditing: false,
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
      res.redirect(`/contacts`);
    });
  } catch (e) {
    console.error(e);
    return res.render("404");
  }
};
exports.editIndex = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contact = await Contact.getContact(req.params.id);
    const contacts = await Contact.getAllContacts();

    if (!contact) return res.render("404");

    res.render("contacts", { contact, contacts, isEditing: true });
  } catch (e) {
    console.error(e);
    return res.render("404");
  }
};
exports.editContact = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contact = new Contact(req.body);
    await contact.updateContact(req.params.id);

    if (!contact) return res.render("404");

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => {
        return res.redirect(`/contacts/${req.params.id}`);
      });
      return;
    }

    req.flash("success", contact.success);
    req.session.save(() => {
      return res.redirect(`/contacts`);
    });
  } catch (e) {
    console.error(e);
    return res.render("404");
  }
};
exports.deleteContact = async (req, res) => {
  try {
    await Contact.removeContact(req.params.id);
    req.flash("success", `Contato removido com sucesso!`);
    req.session.save(() => {
      res.redirect("/contacts");
    });
  } catch (e) {
    console.error(e);
    return res.render("404");
  }
};
