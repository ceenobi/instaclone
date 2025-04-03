import axios from "axios";

const BASEURL = import.meta.env.VITE_BASE_URL;
const timeout = "Waiting for too long...Aborted!";

const config = {
  baseURL: BASEURL,
  timeoutErrorMessage: timeout,
};

const axiosInstance = axios.create(config);

export default axiosInstance;
