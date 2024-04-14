/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

async function login(email, password) {
  try {
    // console.log(email, password);
    const res = await axios.post("http://127.0.0.1:3000/api/v1/users/login", {
      email,
      password,
    });

    if (res.data.status === "success") {
      showAlert("success", "logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", err.response.data.message);
  }
}

async function logout() {
  try {
    const res = await axios.get("http://127.0.0.1:3000/api/v1/users/logout");
    if (res.data.status === "success") location.reload(true);
  } catch (error) {
    showAlert("error", err.response.data.message);
  }
}

export { login, logout };
