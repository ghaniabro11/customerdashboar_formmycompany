// lib/axiosServer.ts
"use server";

import "server-only";
import axios, { AxiosError, AxiosInstance } from "axios";
import { cookies } from "next/headers";
import logger from "./logger/logger";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const AUTH_COOKIE = "ldjsldjs82ydkz";

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
  });

  // Add token from cookies + request log
  instance.interceptors.request.use(async (config) => {
    const cookie = await cookies()
    const token = cookie.get(AUTH_COOKIE)?.value;
    logger.info(token,"Token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    logger.info(
      `[REQ] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  });

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

// Public instance without auth interceptors for cached/static data
function createPublicAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
  });

  // Only add logging, no auth
  instance.interceptors.request.use(async (config) => {
    logger.info(
      `[REQ] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      logger.info(`[RES] ${res.status} ${res.config.url}`);
      return res;
    },
    (err: AxiosError) => {
      const status = err.response?.status;
      logger.info(`[ERR] ${status} ${err.config?.url}`);
      throw err;
    }
  );

  return instance;
}

// Export a ready-to-use server-only instance
export const axiosInstanceServer = createAxiosInstance();
export const axiosPublicServer = createPublicAxiosInstance();