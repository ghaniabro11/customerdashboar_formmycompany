"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/secureStorage";
import logger from "@/lib/logger/logger";
import { Money } from "@/constants/types";

export type CartNotificationType = "success" | "error";

export interface CartNotification {
  type: CartNotificationType;
  message: string;
}

export interface Service {
  id: string;
  checkoutId?: number;
  slug?: string;
  title: string;
  type: string;
  price: Money;
  discount?: Money;
  vat?: Money;
  meta?: any;
}

export type Step =
  | "name-search"
  | "additional-services"
  | "payment"
  | "confirmation";

interface StoreState {
  currentStep: Step;
  companyName: string;
  services: Service[];
  paymentStatus: "idle" | "processing" | "success" | "failed";
  cartNotification: CartNotification | null;

  // actions
  setCompanyName: (name: string) => void;
  addService: (service: Omit<Service, "id">) => void;
  removeService: (id: string) => void;
  updateService: (id: string, updated: Partial<Service>) => void;
  clearServices: () => void;
  setPaymentStatus: (
    status: "idle" | "processing" | "success" | "failed"
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: Step) => void;
  reset: () => void;
  clearCartNotification: () => void;
  syncCartFromUrl: (slug: string, type: string) => Promise<void>;
}

const steps: Step[] = [
  "name-search",
  "additional-services",
  "payment",
  "confirmation",
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentStep: "name-search",
      companyName: "",
      services: [],
      paymentStatus: "idle",
      cartNotification: null,

      setCompanyName: (name) => set({ companyName: name }),

      addService: (service) => {
        const existingServices = get().services;

        const normalizeTitle = (value: string) =>
          value.trim().toLowerCase();

        const makeSignature = (payload: Omit<Service, "id">) => ({
          checkoutId: payload.checkoutId ?? null,
          type: payload.type,
          title: normalizeTitle(payload.title),
          price: payload.price,
        });

        const incomingSignature = makeSignature(service);

        const isDuplicate = existingServices.some((existing) => {
          const existingSignature = makeSignature(existing);
        
          return (
            existingSignature.checkoutId === incomingSignature.checkoutId &&
            existingSignature.type === incomingSignature.type &&
            existingSignature.title === incomingSignature.title &&
            JSON.stringify(existingSignature.price) ===
              JSON.stringify(incomingSignature.price)
          );
        });


        if (isDuplicate) {
          set({
            cartNotification: {
              type: "error",
              message: `"${service.title}" is already in your cart.`,
            },
          });
          return;
        }

        const id = crypto.randomUUID();
        set({
          services: [...existingServices, { id, ...service }],
          cartNotification: {
            type: "success",
            message: `"${service.title}" has been added to your cart.`,
          },
        });
      },

      removeService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      updateService: (id, updated) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...updated } : s
          ),
        })),

      clearServices: () => set({ services: [] }),

      setPaymentStatus: (status) => set({ paymentStatus: status }),

      nextStep: () => {
        const current = get().currentStep;
        const nextIndex = steps.indexOf(current) + 1;
        if (nextIndex < steps.length) set({ currentStep: steps[nextIndex] });
      },

      prevStep: () => {
        const current = get().currentStep;
        const prevIndex = steps.indexOf(current) - 1;
        if (prevIndex >= 0) set({ currentStep: steps[prevIndex] });
      },

      goToStep: (step) => set({ currentStep: step }),

      reset: () =>
        set({
          currentStep: "name-search",
          companyName: "",
          services: [],
          paymentStatus: "idle",
        }),

      clearCartNotification: () => set({ cartNotification: null }),

      syncCartFromUrl: async (slug, type) => {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/getCartProduct?slug=${slug}&type=${type}`;

          console.log("API URL:", apiUrl);
          
          const response = await fetch(apiUrl, {
            headers: {
              Accept: "application/json",
            },
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Failed to fetch product | Status: ${response.status} | ${errorText}`
            );
          }
          
          const product = await response.json();
          console.log("PRODUCT:", product);
      
          get().addService({
            checkoutId: product.checkoutId,
            slug: product.slug,
            title: product.title,
            type: product.type,
            price: Number(product.price),
            discount: Number(product.discount ?? 0),
            vat: Number(product.vat ?? 0),
            meta: product.meta ?? {},
          });
        } catch (error) {
          logger.error("Cart sync error:", error);
        }
      },
    }),
    {
      name: "app-store", // cookie name
      partialize: (state) => ({
        currentStep: state.currentStep,
        companyName: state.companyName,
        services: state.services,
        paymentStatus: state.paymentStatus,
      }),
      storage: createJSONStorage(() => ({
        // 🔐 Read from cookie (decrypt)
        async getItem(name) {
          try {
            const encrypted = Cookies.get(name);
            if (!encrypted) return null;
            const decrypted = await decrypt(encrypted);
            return JSON.parse(decrypted);
          } catch (err) {
            logger.error("❌ Cookie decrypt error:", err);
            return null;
          }
        },
        // 🔐 Write to cookie (encrypt)
        async setItem(name, value) {
          try {
            const json = JSON.stringify(value);
            const encrypted = await encrypt(json);
            Cookies.set(name, encrypted, {
              expires: 7, // store for 7 days
              secure: true,
              sameSite: "Strict",
            });
          } catch (err) {
            logger.error("❌ Cookie encrypt error:", err);
          }
        },
        async removeItem(name) {
          Cookies.remove(name);
        },
      })),
    }
  )
);
