export default class FormValidator {
  constructor(form) {
    this.form = form;
    this.errors = {};
  }

  clearErrors() {
    this.errors = {};
    this.form.querySelectorAll(".is-invalid").forEach((input) => {
      input.classList.remove("is-invalid");
    });

    this.form.querySelectorAll(".invalid-feedback").forEach((el) => {
      el.remove();
    });
  }

  setError(input, message) {
    input.classList.add("is-invalid");

    const feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    feedback.innerText = message;

    input.parentElement.appendChild(feedback);
    this.errors[input.name] = message;
  }

  isValid() {
    return Object.keys(this.errors).length === 0;
  }
}
