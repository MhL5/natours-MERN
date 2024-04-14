import axios from "axios";

const axiosApi = axios.create({
  baseURL: "http://127.0.0.1:3000/api/v1/",
  timeout: 10 * 1000,
  //   headers: { "X-Custom-Header": "foobar" },
  withCredentials: true,
});

export { axiosApi };
