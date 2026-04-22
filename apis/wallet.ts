"use server";

import axios from "axios";
import { cookies } from "next/headers";
import FormData from "form-data";
import logger from "@/lib/logger/logger";

const WALLET_API_BASE_URL = "https://login.mycompanyregistration.uk/api";
const AUTH_COOKIE = "ldjsldjs82ydkz";

interface WalletBalanceResponse {
  balance: string;
}

interface WalletCreditPayload {
  amount: string;
  remarks: string;
  payment: {
    billing: {
      first_name: string;
      last_name: string;
      address: string;
      city: string;
      country: string;
      postal_code: string;
      email: string;
      phone: string;
    };
    currency: string;
    amount: number;
    id: string;
    status: string;
    created: number;
    card: {
      brand: string;
      exp_month: string;
      exp_year: string;
      last4: string;
    };
    response: any;
  };
}

interface WalletTransaction {
  id: number;
  customer_id: number;
  type: "credit" | "debit";
  amount: string;
  reference: string | null;
  remarks: string;
  balance_after: string;
  created_at: string;
  updated_at: string;
}

interface WalletCreditResponse {
  ok: boolean;
  message?: string;
  data?: any;
}

interface CheckoutViaWalletPayload {
  company: {
    company_name: string;
    company_type: string;
    business_activity: string;
    country: string;
    city: string;
    contact_phone: string;
    contact_email: string;
    registered_address: string;
    postcode: string;
  };
  items: Array<{
    type: string;
    id: string;
    quantity: string;
    meta?: {
      features?: string[];
      service_id?: string;
    };
  }>;
}

interface CheckoutViaWalletResponse {
  ok: boolean;
  message?: string;
  data?: any;
}

// Fetch wallet balance
export async function fetchWalletBalance(): Promise<WalletBalanceResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    
    if (!token) {
      logger.warn("No authentication token found for wallet balance");
      return null;
    }

    const response = await axios.get<WalletBalanceResponse>(
      `${WALLET_API_BASE_URL}/customer-wallet-balance`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    logger.info(response.data, "Wallet balance fetched");
    return response.data;
  } catch (error: any) {
    logger.error(
      error.response?.data || error.message,
      "Failed to fetch wallet balance"
    );
    return null;
  }
}

// Add credit to wallet
export async function addWalletCredit(
  payload: WalletCreditPayload
): Promise<WalletCreditResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return { ok: false, message: "Unauthorized. Please log in." };
    }

    logger.info(payload, "Adding wallet credit");

    const formData = new FormData();
    formData.append("amount", payload.amount);
    formData.append("remarks", payload.remarks);

    // Payment billing details
    formData.append("payment[billing][first_name]", payload.payment.billing.first_name);
    formData.append("payment[billing][last_name]", payload.payment.billing.last_name);
    formData.append("payment[billing][address]", payload.payment.billing.address);
    formData.append("payment[billing][city]", payload.payment.billing.city);
    formData.append("payment[billing][country]", payload.payment.billing.country);
    formData.append("payment[billing][postal_code]", payload.payment.billing.postal_code);
    formData.append("payment[billing][email]", payload.payment.billing.email);
    formData.append("payment[billing][phone]", payload.payment.billing.phone);

    // Payment details
    formData.append("payment[currency]", payload.payment.currency);
    formData.append("payment[amount]", String(payload.payment.amount));
    formData.append("payment[id]", payload.payment.id);
    formData.append("payment[status]", payload.payment.status);
    formData.append("payment[created]", String(payload.payment.created));

    // Card details
    formData.append("payment[card][brand]", payload.payment.card.brand);
    formData.append("payment[card][exp_month]", payload.payment.card.exp_month);
    formData.append("payment[card][exp_year]", payload.payment.card.exp_year);
    formData.append("payment[card][last4]", payload.payment.card.last4);

    // Payment response
    if (payload.payment.response) {
      formData.append("payment[response]", JSON.stringify(payload.payment.response));
    }

    const response = await axios.post(
      `${WALLET_API_BASE_URL}/customer-wallet-credit`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    logger.info(response.data, "Wallet credit added successfully");
    return {
      ok: true,
      data: response.data,
    };
  } catch (error: any) {
    logger.error(
      error.response?.data || error.message,
      "Failed to add wallet credit"
    );
    return {
      ok: false,
      message:
        error.response?.data?.message || "Failed to add credit. Please try again.",
    };
  }
}

// Fetch wallet transactions
export async function fetchWalletTransactions(): Promise<WalletTransaction[] | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      logger.warn("No authentication token found for wallet transactions");
      return null;
    }

    const response = await axios.get<WalletTransaction[]>(
      `${WALLET_API_BASE_URL}/customer-wallet-transactions`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    logger.info(response.data, "Wallet transactions fetched");
    return response.data;
  } catch (error: any) {
    logger.error(
      error.response?.data || error.message,
      "Failed to fetch wallet transactions"
    );
    return null;
  }
}

// Checkout via wallet
export async function checkoutViaWallet(
  payload: CheckoutViaWalletPayload
): Promise<CheckoutViaWalletResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return { ok: false, message: "Unauthorized. Please log in." };
    }

    logger.info(payload, "Checkout via wallet payload");

    const formData = new FormData();

    // Company info
    formData.append("company[company_name]", payload.company.company_name);
    formData.append("company[company_type]", payload.company.company_type);
    formData.append("company[business_activity]", payload.company.business_activity);
    formData.append("company[country]", payload.company.country);
    formData.append("company[city]", payload.company.city);
    formData.append("company[contact_phone]", payload.company.contact_phone);
    formData.append("company[contact_email]", payload.company.contact_email);
    formData.append("company[registered_address]", payload.company.registered_address);
    formData.append("company[postcode]", payload.company.postcode);

    // Items array
    payload.items.forEach((item, i) => {
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

    const response = await axios.post(
      `${WALLET_API_BASE_URL}/checkoutViaWallet`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    logger.info(response.data, "Checkout via wallet successful");
    return {
      ok: true,
      data: response.data,
    };
  } catch (error: any) {
    logger.error(
      error.response?.data || error.message,
      "Failed to checkout via wallet"
    );
    return {
      ok: false,
      message:
        error.response?.data?.message || "Checkout via wallet failed. Please try again.",
    };
  }
}
