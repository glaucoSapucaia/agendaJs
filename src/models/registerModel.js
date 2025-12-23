const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const RegisterSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const RegisterModel = mongoose.model("Register", RegisterSchema);

class Register {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.success = [];
    this.user = null;
  }

  async verifyUser() {
    this.fieldsValidation();
    if (this.errors.length > 0) return;

    try {
      const salt = bcryptjs.genSaltSync();
      this.body.password = bcryptjs.hashSync(this.body.password, salt);
      this.user = await RegisterModel.create(this.body);
      this.success.push(`Usuário ${this.body.email} registrado com sucesso!`);
    } catch (e) {
      console.error(e);
    }
  }

  fieldsValidation() {
    this.cleanData();
    const user = this.userExists();

    if (user) {
      this.errors.push(`O usuário ${this.body.email} já existe!`);
    }

    if (!validator.isEmail(this.body.email)) {
      this.errors.push("Email inválido!");
    }

    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push("A senha deve conter de 3 a 50 caracteres!");
    }
  }

  cleanData() {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }

  async userExists() {
    await RegisterModel.findOne({ email: this.body.email });
  }
}

module.exports = Register;
