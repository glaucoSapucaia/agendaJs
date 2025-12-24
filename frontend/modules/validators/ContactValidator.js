import validator from "validator";
import FormValidator from "./interfaces/FormValidator.js";

export default class ContactValidator extends FormValidator {
  validate() {
    this.clearErrors();

    const email = this.form.querySelector("#email");
    const name = this.form.querySelector("#name");

    // E-mail
    if (!email.value.trim()) {
      this.setError(email, "O e-mail do contato é obrigatório.");
    } else if (!this.isValidEmail(email.value)) {
      this.setError(email, "Informe um e-mail válido.");
    }

    // Senha
    if (!name.value.trim()) {
      this.setError(name, "O nome do contato é obrigatório.");
    }

    return this.isValid();
  }

  isValidEmail(email) {
    return validator.isEmail(email);
  }
}
