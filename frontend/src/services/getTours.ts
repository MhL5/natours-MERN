import { TourData } from "../pages/TourOverview";
import { axiosApi } from "./api";

type TourResponse = {
  status: string;
  data: {
    data: TourData[];
  };
};

async function getTours() {
  const res = await axiosApi.get("tours");

  return res.data as TourResponse;
}

export { getTours };
