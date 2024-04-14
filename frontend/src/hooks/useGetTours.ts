import { useQuery } from "@tanstack/react-query";
import { getTours } from "../services/getTours";

function useGetTours() {
  const {
    data: tours,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tour"],
    queryFn: getTours,
  });

  return { tours, error, isLoading };
}

export { useGetTours };
