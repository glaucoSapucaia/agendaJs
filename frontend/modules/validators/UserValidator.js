import validator from "validator";
import FormValidator from "./interfaces/FormValidator.js";

export default class UserValidator extends FormValidator {
  validate() {
    this.clearErrors();

    const email = this.form.querySelector("#email");
    const password = this.form.querySelector("#password");

    // E-mail
    if (!email.value.trim()) {
      this.setError(email, "O e-mail é obrigatório.");
    } else if (!this.isValidEmail(email.value)) {
      this.setError(email, "Informe um e-mail válido.");
    }

    // Senha
    if (!password.value.trim()) {
      this.setError(password, "A senha é obrigatória.");
    } else if (password.value.length < 3 || password.value.length > 50) {
      this.setError(password, "A senha deve ter entre 3 e 50 caracteres.");
    }

    return this.isValid();
  }

  isValidEmail(email) {
    return validator.isEmail(email);
  }
}
