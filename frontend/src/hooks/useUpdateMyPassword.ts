import { useMutation } from "@tanstack/react-query";
import { updateMyPassword as updateMyPasswordApi } from "../services/updateMyPassword";
import { showAlert } from "../utils/alert";

function useUpdateMyPassword() {
  const {
    mutate: updateMyPassword,
    isPending,
    error,
  } = useMutation({
    mutationFn: updateMyPasswordApi,
    onSuccess: () => {
      showAlert("success", "password updated successfully");
    },
    onError: () => {
      showAlert("error", "updating password failed");
    },
  });

  return { updateMyPassword, isPending, error };
}

export { useUpdateMyPassword };
