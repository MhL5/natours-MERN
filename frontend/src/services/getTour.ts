import { axiosApi } from "./api";

async function getTour({ tourId }: { tourId: string }) {
  const res = await axiosApi.get(`tours/${tourId}`);

  return res;
}

export { getTour };
