"use server";

import { cookies } from "next/headers";
import FormData from "form-data";
import axios from "axios";
import logger from "@/lib/logger/logger";

interface WorkspaceCheckoutPayload {
  currency: string;
  billing: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    postcode: string;
  };
  items: Array<{
    id: string;
    duration: string;
  }>;
  paymentMethodId: string;
  payment: any;
}

interface WorkspaceCheckoutResponse {
  ok: boolean;
  message?: string;
  data?: any;
}

export async function workspaceCheckoutAction(
  payload: WorkspaceCheckoutPayload
): Promise<WorkspaceCheckoutResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ldjsldjs82ydkz")?.value;
    logger.info(token, "tokennnnn");

    if (!token) {
      return { ok: false, message: "Unauthorized. Please log in." };
    }

    // Build form data according to API requirements
    const formData = new FormData();
    formData.append("currency", payload.currency);
    formData.append("billing[first_name]", payload.billing.first_name);
    formData.append("billing[last_name]", payload.billing.last_name);
    formData.append("billing[address]", payload.billing.address);
    formData.append("billing[city]", payload.billing.city);
    formData.append("billing[postcode]", payload.billing.postcode);

    // Add items
    payload.items.forEach((item, index) => {
      formData.append(`items[${index}][id]`, item.id);
      formData.append(`items[${index}][duration]`, item.duration);
    });

    // Payment fields - send as individual form fields matching curl format
    if (payload.payment?.billing) {
      formData.append("payment[billing][first_name]", payload.payment.billing.first_name || "");
      formData.append("payment[billing][last_name]", payload.payment.billing.last_name || "");
      formData.append("payment[billing][address]", payload.payment.billing.address || "");
      formData.append("payment[billing][city]", payload.payment.billing.city || "");
      formData.append("payment[billing][country]", payload.payment.billing.country || "");
      formData.append("payment[billing][postal_code]", payload.payment.billing.postal_code || "");
      formData.append("payment[billing][email]", payload.payment.billing.email || "");
      formData.append("payment[billing][phone]", payload.payment.billing.phone || "");
    }
    
    if (payload.payment?.currency) {
      formData.append("payment[currency]", payload.payment.currency);
    }
    if (payload.payment?.amount !== undefined) {
      formData.append("payment[amount]", String(payload.payment.amount));
    }
    if (payload.payment?.id) {
      formData.append("payment[id]", payload.payment.id);
    }
    if (payload.payment?.status) {
      formData.append("payment[status]", payload.payment.status);
    }
    if (payload.payment?.created) {
      formData.append("payment[created]", String(payload.payment.created));
    }
    
    if (payload.payment?.card) {
      formData.append("payment[card][brand]", payload.payment.card.brand || "");
      formData.append("payment[card][exp_month]", String(payload.payment.card.exp_month || ""));
      formData.append("payment[card][exp_year]", String(payload.payment.card.exp_year || ""));
      formData.append("payment[card][last4]", payload.payment.card.last4 || "");
    }
    
    if (payload.payment?.response) {
      formData.append("payment[response]", JSON.stringify(payload.payment.response));
    }

    logger.info("Workspace checkout payload:", {
      currency: payload.currency,
      billing: payload.billing,
      items: payload.items,
    });

    const response = await axios.post(
      "https://login.formmycompany.uk/api/workspace-checkout",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    logger.info("Workspace checkout response:", response.data);

    return {
      ok: true,
      data: response.data,
    };
  } catch (error: any) {
    logger.error(
      "Workspace checkout error:",
      error.response?.data || error.message
    );
    return {
      ok: false,
      message:
        error.response?.data?.message || "Checkout failed. Please try again.",
    };
  }
}
