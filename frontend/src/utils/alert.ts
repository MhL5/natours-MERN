// TODO: replace this with  React toast library or useRef instead of manually selecting dom elements
function showAlert(type: "success" | "error", msg: string) {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body")!.insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
}

function hideAlert() {
  const el = document.querySelector(".alert") as HTMLDivElement;
  if (el) el.parentElement!.removeChild(el);
}

export { showAlert };
