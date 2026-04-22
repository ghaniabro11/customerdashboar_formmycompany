// app/my-details/MyDetailsForm.tsx
"use client";

import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Button } from "../ui/button";

const schema = z.object({
  title: z.string().nullable().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().nullable().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  dob: z.string().nullable().optional(), // yyyy-mm-dd or empty
  proof_verified: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function coerceNullsToEmpty<T extends Record<string, any>>(obj: T) {
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) out[k] = v ?? "";
  return out as T;
}

export function MyDetailsForm({
  initialData,
  updateAction,
}: {
  initialData: FormValues;
  updateAction: (payload: FormValues) => Promise<{ ok: boolean; data?: any }>;
}) {
  const [isPending, startTransition] = useTransition();
  const isMounted = useIsMounted();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: coerceNullsToEmpty(initialData),
    mode: "onSubmit",
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await updateAction(values);
      if (result?.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
      // if (result?.ok) {
      //   // simple UX – replace with your toast system if available
      //   // alert("Profile updated");
      // } else {
      //   // alert("Update failed");
      // }
    });
  };
  if (!isMounted) return null;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Readonly/meta */}

      {/* Editable */}
      <div className="">
        <div className="grid grid-cols-2 items-center gap-2 mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <select
            className="w-full border rounded px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...form.register("title")}
          >
            <option value="">Choose an option</option>
            <option value="Mr">Mr</option>
            <option value="Miss">Miss</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
            <option value="Master">Master</option>
            <option value="Rev">Rev</option>
            <option value="Sir">Sir</option>
            <option value="Lord">Lord</option>
            <option value="Lady">Lady</option>
            <option value="Mx">Mx</option>
          </select>
        </div>
        <div className="grid grid-cols-2 items-center gap-2 mb-5">
          <label className="block text-sm mb-1">First Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...form.register("first_name")}
          />
          {form.formState.errors.first_name && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.first_name.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 items-center gap-2 mb-5">
          <label className="block text-sm mb-1">Last Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...form.register("last_name")}
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-2 mb-5 ">
          <label className="block text-sm mb-1">Email</label>
          <input
            disabled
            className="w-full border rounded px-3 py-2 cursor-not-allowed"
            type="email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 items-center gap-2 mb-5">
          <label className="block text-sm mb-1">Phone</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...form.register("phone")}
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-2 mb-5">
          <label className="block text-sm mb-1">Country</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...form.register("country")}
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-2 mb-5">
          <label className="block text-sm mb-1">Address</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...form.register("address")}
          />
        </div>
        <div className="grid grid-cols-2 items-center gap-2 mb-5">
          <label className="block text-sm mb-1">Date of Birth</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="date"
            {...form.register("dob")}
          />
        </div>
        {/* <div className="flex items-center gap-2 mt-7">
          <input
            id="proof_verified"
            type="checkbox"
            {...form.register("proof_verified")}
          />
          <label htmlFor="proof_verified" className="text-sm">
            Proof Verified
          </label>
        </div> */}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          variant="orange"
          className="w-full"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
