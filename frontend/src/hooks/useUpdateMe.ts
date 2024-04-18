import { useMutation } from "@tanstack/react-query";
import { axiosApi } from "../services/api";
import { showAlert } from "../utils/alert";
import { useAuthContext } from "../contexts/AuthContext";
import { isAxiosError } from "axios";

function useUpdateMe() {
  const { setUserFn } = useAuthContext();
  const {
    mutate: updateMe,
    isPending,
    error,
    data: newUserData,
  } = useMutation({
    mutationFn: async ({ userFormData }: { userFormData: FormData }) => {
      const res = await axiosApi.patch("users/updateme", userFormData);
      return res;
    },
    onSuccess: (res) => {
      showAlert("success", "Success");
      setUserFn(res.data.data.user);
    },
    onError: (error) => {
      if (isAxiosError(error))
        showAlert("error", `${error?.response?.data.message}`);
      else showAlert("error", "unknown error");
    },
  });

  return { updateMe, isPending, error, newUserData };
}

export { useUpdateMe };
