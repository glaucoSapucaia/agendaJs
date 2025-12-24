const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  email: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now() },
});

const ContactModel = mongoose.model("Contact", ContactSchema);

class Contact {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.success = [];
    this.contact = null;
  }

  async verifyContactRegister() {
    await this.fieldsValidation();
    if (this.errors.length > 0) return;

    this.contact = await ContactModel.create(this.body);
    this.success.push(`Contato ${this.body.email} registrado com sucesso!`);
  }

  async fieldsValidation(emailExistsVerify = true) {
    this.cleanData();
    const contact = await this.contactExists();

    if (!this.body.nome) {
      this.errors.push("Campo nome vazio!");
      return;
    }

    if (!this.body.email) {
      this.errors.push("Campo email vazio!");
      return;
    }
    if (emailExistsVerify) {
      if (contact) this.errors.push(`O contato ${this.body.email} já existe!`);
      return;
    }

    if (!validator.isEmail(this.body.email))
      this.errors.push("Email inválido!");
  }

  cleanData() {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      nome: this.body.name,
      sobrenome: this.body.lastname,
      telefone: this.body.phone,
      email: this.body.email,
    };
  }

  async contactExists() {
    return await ContactModel.findOne({ email: this.body.email });
  }

  static async getContact(id) {
    if (typeof id !== "string") return;

    const contact = await ContactModel.findById(id);
    return contact;
  }

  static async getAllContacts() {
    const contacts = await ContactModel.find();
    return contacts;
  }

  static async removeContact(id) {
    if (typeof id !== "string") return;

    const contact = ContactModel.findById(id);
    if (!contact) return;

    await ContactModel.findByIdAndDelete(id);
  }

  async updateContact(id) {
    if (typeof id !== "string") return;
    const emailExistsVerify = false;

    await this.fieldsValidation(emailExistsVerify);
    if (this.errors.length > 0) return;

    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
    this.success.push(
      `Edição do contato ${this.contact.email} efetuada com sucesso!`
    );
  }
}

module.exports = Contact;
