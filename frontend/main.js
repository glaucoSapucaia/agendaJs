import "core-js/stable";
import "regenerator-runtime/runtime";
import "./assets/css/style.css";

import UserValidator from "./modules/validators/UserValidator.js";
import ContactValidator from "./modules/validators/ContactValidator.js";

const validatorsMap = {
  userValidator: UserValidator,
  contactValidator: ContactValidator,
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    const type = form.dataset.validate;
    const ValidatorClass = validatorsMap[type];

    if (!ValidatorClass) return;

    const validator = new ValidatorClass(form);

    form.addEventListener("submit", (e) => {
      if (!validator.validate()) {
        e.preventDefault();
      }
    });
  });
});
