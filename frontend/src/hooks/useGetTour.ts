import { useQuery } from "@tanstack/react-query";
import { getTour } from "../services/getTour";

function useGetTour({ tourId }: { tourId: string }) {
  const {
    data: tour,
    error,
    isLoading,
  } = useQuery({
    queryKey: [tourId],
    queryFn: () => getTour({ tourId }),
  });

  return { tour, error, isLoading };
}

export { useGetTour };
