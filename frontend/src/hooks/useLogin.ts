import { useMutation } from "@tanstack/react-query";
import { login } from "../services/login";
import { showAlert } from "../utils/alert";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

function useLogin() {
  const { setUserFn } = useAuthContext();
  const navigate = useNavigate();
  const {
    data: userData,
    mutate: loginFn,
    isPending,
  } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login({ email, password }),
    onSuccess: (res) => {
      setUserFn(res.data.data.user);
      showAlert("success", "logged in");
      navigate(-1);
    },
    onError: (err) => {
      if (isAxiosError(err))
        showAlert(
          "error",
          `${err?.response?.status} ${err?.response?.data.message}`
        );
      else showAlert("error", `${err.name} ${err.message}`);
    },
  });

  return { userData, loginFn, isPending };
}

export { useLogin };
