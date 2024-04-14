import { axiosApi } from "./api";

async function login({ email, password }: { email: string; password: string }) {
  const res = await axiosApi.post("users/login", {
    email,
    password,
  });
  
  return res;
}

export { login };
