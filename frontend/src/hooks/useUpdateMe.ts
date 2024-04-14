import { useMutation } from "@tanstack/react-query";
import { axiosApi } from "../services/api";
import { showAlert } from "../utils/alert";
import { useAuthContext } from "../contexts/AuthContext";

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
    onError: () => {
      showAlert("error", "bad bad");
    },
  });

  return { updateMe, isPending, error, newUserData };
}

export { useUpdateMe };
