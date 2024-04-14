/* eslint-disable */

function showAlert(type, msg) {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
}

function hideAlert() {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
}

export { showAlert };
