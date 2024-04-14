import { useMutation } from "@tanstack/react-query";
import { login } from "../services/login";
import { showAlert } from "../utils/alert";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
    onError: () => {
      showAlert("error", "something went wrong");
    },
  });

  return { userData, loginFn, isPending };
}

export { useLogin };
