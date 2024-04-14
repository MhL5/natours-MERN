import { TourData } from "../pages/TourOverview";
import { axiosApi } from "./api";

type TourResponse = {
  status: string;
  data: {
    data: TourData[];
  };
};

async function getMyTours() {
  const res = await axiosApi.get("tours/getmytours");

  if (res?.response?.data?.status === "fail")
    throw new Error("Something went wrong wrong");

  return res.data as TourResponse;
}

export { getMyTours };
