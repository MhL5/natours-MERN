import { useQuery } from "@tanstack/react-query";
import { getMyTours } from "../services/getMyTours";

function useGetMyTours() {
  const {
    data: myTours,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myTours"],
    queryFn: getMyTours,
  });

  return { myTours, isLoading, error };
}

export { useGetMyTours };
