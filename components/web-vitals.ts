"use client";

 import logger from "@/lib/logger/logger";
import { NextWebVitalsMetric } from "next/app";
import { useReportWebVitals } from "next/web-vitals";

const logWebVitals = (metric: NextWebVitalsMetric) => {
  logger.info(metric);
};

export function WebVitals() {
  useReportWebVitals(logWebVitals);

  return null;
}
