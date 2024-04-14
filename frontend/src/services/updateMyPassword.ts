import { axiosApi } from "./api";

type UpdateMyPassword = {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
};

async function updateMyPassword({
  password,
  passwordConfirm,
  passwordCurrent,
}: UpdateMyPassword) {
  const res = await axiosApi.patch(
    "users/updatemypassword",
    { passwordCurrent, password, passwordConfirm }
  );

  return res;
}

export { updateMyPassword };
