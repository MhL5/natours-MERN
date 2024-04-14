import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/logout";
import { showAlert } from "../utils/alert";

function useLogout() {
  const { mutate: logoutFn, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      showAlert("success", "successfully logged out");
    },
    onError: (error) => {
      showAlert("error", `something went wrong while logging out: ${error}`);
    },
  });

  return { logoutFn, isPending };
}

export { useLogout };
