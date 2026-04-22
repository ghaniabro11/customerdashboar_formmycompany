"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/secureStorage";
import logger from "@/lib/logger/logger";
import { toast } from "sonner";

export interface WorkspaceItem {
  id: string;
  workspaceId: string;
  title: string;
  location?: string;
  featured_image?: string;
  itemId: string; // API item ID (static: "5")
  duration: string; // Duration in months (static: "3")
  price?: number;
  meta?: any;
}

interface WorkspaceCheckoutState {
  workspaces: WorkspaceItem[];
  paymentStatus: "idle" | "processing" | "success" | "failed";

  // Actions
  addWorkspace: (workspace: Omit<WorkspaceItem, "id">) => void;
  removeWorkspace: (id: string) => void;
  updateWorkspace: (id: string, updated: Partial<WorkspaceItem>) => void;
  clearWorkspaces: () => void;
  setPaymentStatus: (
    status: "idle" | "processing" | "success" | "failed"
  ) => void;
  reset: () => void;
}

export const useWorkspaceCheckoutStore = create<WorkspaceCheckoutState>()(
  persist(
    (set, get) => ({
      workspaces: [],
      paymentStatus: "idle",

      addWorkspace: (workspace) => {
        const existingWorkspaces = get().workspaces;

        // Check if workspace already exists
        const isDuplicate = existingWorkspaces.some(
          (existing) => existing.workspaceId === workspace.workspaceId
        );

        if (isDuplicate) {
          toast.error(`Workspace "${workspace.title}" is already in checkout`);
          return;
        }

        const id = crypto.randomUUID();
        set({
          workspaces: [
            ...existingWorkspaces,
            {
              id,
              ...workspace,
              itemId: workspace.itemId || "5", // Default static value
              duration: workspace.duration || "3", // Default static value
            },
          ],
        });
        toast.success(`Added "${workspace.title}" to checkout`);
      },

      removeWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
        })),

      updateWorkspace: (id, updated) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id ? { ...w, ...updated } : w
          ),
        })),

      clearWorkspaces: () => set({ workspaces: [] }),

      setPaymentStatus: (status) => set({ paymentStatus: status }),

      reset: () =>
        set({
          workspaces: [],
          paymentStatus: "idle",
        }),
    }),
    {
      name: "workspace-checkout-store",
      storage: createJSONStorage(() => ({
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
