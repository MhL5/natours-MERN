import { axiosApi } from "./api";

async function logout() {
  const res = await axiosApi.get("users/logout");

  return res;
}

export { logout };
