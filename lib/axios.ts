
import axios, { AxiosError, AxiosInstance } from "axios";
import logger from "./logger/logger";
import Cookies from "js-cookie";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const AUTH_COOKIE = "token";

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
  });

  // Add token from cookies + request log
  // instance.interceptors.request.use(async (config) => {
  //   const token = Cookies.get(AUTH_COOKIE);
  //   logger.info(token);
  //   if (token) config.headers.Authorization = `Bearer ${token}`;
  //   logger.info(
  //     `[REQ] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  //   );
  //   return config;
  // });

  // Handle responses and 401 cleanup
  instance.interceptors.response.use(
    (res) => {
      logger.info(`[RES] ${res.status} ${res.config.url}`);
      return res;
    },
    (err: AxiosError) => {
      const status = err.response?.status;
      logger.info(`[ERR] ${status} ${err.config?.url}`);
      if (status === 401) {
        // const cookie = async () => (await cookies()).get(AUTH_COOKIE)?.value;
        // if (cookie.get(AUTH_COOKIE)) cookie.delete(AUTH_COOKIE);
      }
      throw err;
    }
  );

  return instance;
}

// Export a ready-to-use server-only instance
export const axiosInstance = createAxiosInstance();
