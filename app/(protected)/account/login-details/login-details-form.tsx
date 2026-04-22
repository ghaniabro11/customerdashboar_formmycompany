"use client";

import { BACKEND_URL } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  email: string;
  password: string;
  password_confirmation: string;
};

const LoginDetailsForm = ({ token }: { token: string }) => {
  const { data: session } = useSession();
  logger.info("Session:", session);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      email: session?.user?.email || "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    try {
      logger.info("Updated Details:", data);

      // Only send password if it's not empty
      if (!data.password || !data.password_confirmation) {
        alert("Please enter both password fields");
        return;
      }

      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);

      // Better logging - log individual values
      logger.info("Password:", data.password);
      logger.info("Password Confirmation:", data.password_confirmation);

      const response = await fetch(`${BACKEND_URL}/password/change`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        toast.success("Details updated successfully!");
        reset();
      } else {
        logger.error("Failed to update details:", responseData);
        toast.error(
          `Failed to update details: ${
            responseData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      logger.error("Error updating details:", error);
      toast.error("An error occurred while updating details");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-semibold mb-8">Login Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border rounded-md p-6 space-y-6 bg-white"
      >
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email<span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              disabled: true,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            value={session?.user?.email || ""}
            disabled
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Enter a new password"
          />
          <p className="text-gray-500 text-sm mt-1">
            Passwords are case sensitive and must be a minimum of 6 characters.
            Leave blank to keep your existing password.
          </p>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("password_confirmation", {
              validate: (value) =>
                !password || value === password || "Passwords do not match",
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Re-enter password"
          />
          <p className="text-gray-500 text-sm mt-1">
            Passwords are case sensitive and must be a minimum of 6 characters.
            Leave blank to keep your existing password.
          </p>
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* Note and Submit Button */}
        <div className="border-t pt-4">
          <p className="text-gray-600 text-sm mb-4 italic">
            Please double check all your details before saving them.
          </p>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Update my details
          </button>
        </div>
      </form>
    </section>
  );
};

export default LoginDetailsForm;
