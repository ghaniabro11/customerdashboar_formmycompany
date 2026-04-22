// app/actions/customer.ts
"use server";

import { axiosPublicServer } from "@/lib/axiosServer";
import logger from "@/lib/logger/logger";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateCustomerProfile(payload: any) {
  try {
    const cleaned = Object.fromEntries(
      Object.entries(payload).map(([k, v]) => [k, v === "" ? null : v])
    );
    const cookieStore = await cookies();
    const token = cookieStore.get("ldjsldjs82ydkz")?.value;
    if (!token) {
      return { ok: false, message: "Unauthorized" };
    }
    logger.info(cleaned, "Cleaned Payload");
    const res = await axiosPublicServer.post(
      "/customer/personal-information/update",
      cleaned,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(res, "Profile Update Response");

    // Revalidate this page (adjust path if needed)
    revalidatePath("/account/my-details");

    return { ok: true, data: res?.data };
  } catch (error: any) {
    logger.error(JSON.stringify(error.response.data), "Profile Update Error");
    return { ok: false, message: "Failed to update profile" };
  }
}
