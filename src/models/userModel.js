const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("User", UserSchema);

class User {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.success = [];
    this.user = null;
  }

  async verifyUserRegister() {
    await this.fieldsValidation();
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    this.user = await UserModel.create(this.body);
    this.success.push(`Usuário ${this.body.email} registrado com sucesso!`);
  }

  async verifyUserLogin() {
    await this.userValidation();
    if (this.errors.length > 0) return;

    this.success.push(`Bem vindo ${this.body.email}!`);
  }

  async fieldsValidation() {
    this.cleanData();
    const user = await this.userExists();

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

  async userValidation() {
    this.cleanData();
    const user = await UserModel.findOne({ email: this.body.email });
    if (!user) {
      this.errors.push("Usuário inválido!");
      return;
    }

    const password = bcryptjs.compareSync(this.body.password, user.password);
    if (!password) {
      this.errors.push("Senha inválida!");
      return;
    }

    this.user = user;
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
    return await UserModel.findOne({ email: this.body.email });
  }
}

module.exports = User;
