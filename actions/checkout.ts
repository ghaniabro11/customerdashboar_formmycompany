"use server";

import axios from "axios";
import { cookies } from "next/headers";
import FormData from "form-data";
import logger from "@/lib/logger/logger";
import { BACKEND_URL } from "@/constants/url";

// Define the interfaces
interface CheckoutItem {
  type: string;
  id: string;
  quantity: string;
  meta: {
    features?: string[];
    service_id?: string;
  };
}

interface CheckoutPayload {
  company_name: string;
  company_type: string;
  business_activity: string;
  country: string;
  city: string;
  contact_phone: string;
  contact_email: string;
  registered_address: string;
  postcode: string;
  items: CheckoutItem[];
  payment: any;
}

interface CheckoutResponse {
  ok: boolean;
  message?: string;
  data?: any;
}

export async function CheckoutAction(
  payload: CheckoutPayload
): Promise<CheckoutResponse> {
  try {
    logger.info(JSON.stringify(payload), "Checkout Payload");
    const cookieStore = await cookies();
    const token = cookieStore.get("ldjsldjs82ydkz")?.value;
    if (!token) return { ok: false, message: "Unauthorized" };

    // Build form data
    const formData = new FormData();

    // Company info
    formData.append("company[company_name]", payload.company_name);
    formData.append("company[company_type]", payload.company_type);
    formData.append("company[business_activity]", payload.business_activity);
    formData.append("company[country]", payload.country);
    formData.append("company[city]", payload.city);
    formData.append("company[contact_phone]", payload.contact_phone);
    formData.append("company[contact_email]", payload.contact_email);
    formData.append("company[registered_address]", payload.registered_address);
    formData.append("company[postcode]", payload.postcode);

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

    // Items array
    payload.items?.forEach((item, i) => {
      formData.append(`items[${i}][type]`, item.type);
      formData.append(`items[${i}][id]`, item.id);
      formData.append(`items[${i}][quantity]`, item.quantity);

      if (item.meta?.features) {
        item.meta.features.forEach((f, j) =>
          formData.append(`items[${i}][meta][features][${j}]`, f)
        );
      }

      if (item.meta?.service_id) {
        formData.append(`items[${i}][meta][service_id]`, item.meta.service_id);
      }
    });
    logger.info(JSON.stringify(formData), "Checkout Form Data");
    // logger.info(JSON.stringify(payload), "Checkout Form Data");
    // logger.info(formData.getHeaders(), "Checkout Form Data");
    logger.info(token, "Checkout Token");
    // logger.info(payload.payment, "Checkout Payment");
    const res = await axios.post(`${BACKEND_URL}/checkout`, formData, {
      headers: {
        ...formData.getHeaders(),
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    logger.info(res.data, "Checkout Response");
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.info(error.response, "Checkout Error");
    logger.info(
      error.response?.data || error.message,
      "checkout Action Error"
    );
    return { ok: false, message: "Checkout failed" };
  }
}
