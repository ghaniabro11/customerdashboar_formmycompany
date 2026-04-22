"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Director } from "@/constants/types";
import Cookies from "js-cookie";
import logger from "@/lib/logger/logger";
import { BACKEND_URL } from "@/constants/url";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

interface DirectorFormProps {
  mode: "create" | "update";
  directorData: Director | null;
  companyId: string;
  token: string;
}

const DirectorForm = ({
  mode = "create",
  directorData = null,
  companyId,
  token,
}: DirectorFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Director>();

  const [open, setOpen] = useState(false);
  // Set form values for update mode
  const router = useRouter();

  useEffect(() => {
    if (mode === "update" && directorData) {
      setValue("title", directorData.title);
      setValue("first_name", directorData.first_name);
      setValue("last_name", directorData.last_name);
      setValue("service_address", directorData.service_address);
      setValue("residential_address", directorData.residential_address);
      setValue("nationality", directorData.nationality);
      setValue("designation", directorData.designation);
      setValue("company_id", directorData.company_id);
    }
  }, [mode, directorData, setValue]);
  logger.info(token, "token");
  // Handle form submission
  const onSubmit: SubmitHandler<Director> = async (data) => {
    const url =
      mode === "create"
        ? `${BACKEND_URL}/customer/companies/directors`
        : `${BACKEND_URL}/customer/companies/directors/${directorData?.id}`;

    try {
      const res = await axios({
        method: mode === "create" ? "POST" : "POST",
        url,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Replace with actual token
        },
        data: {
          ...data,
          company_id: companyId,
        },
      });
      logger.info(res, "res");
      setOpen(false);
      router.refresh();
      // onSubmitSuccess(); // Callback on successful submit (optional)
    } catch (error) {
      logger.error(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-xs"
          variant={mode === "create" ? "orange" : "outline"}
          size={"sm"}
        >
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-xl font-semibold">
          {mode === "create" ? "Create Director" : "Update Director"}
        </DialogTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 mt-4 grid grid-cols-2 gap-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <select
              {...register("title", { required: "Title is required" })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a title</option>
              <option value="Mr">Mr</option>
              <option value="Miss">Miss</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
            </select>
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <Input
              {...register("first_name", {
                required: "First name is required",
              })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <Input
              {...register("last_name", { required: "Last name is required" })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Address
            </label>
            <Input
              {...register("service_address", {
                required: "Service address is required",
              })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.service_address && (
              <p className="text-red-500 text-sm">
                {errors.service_address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Residential Address
            </label>
            <Input
              {...register("residential_address", {
                required: "Residential address is required",
              })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.residential_address && (
              <p className="text-red-500 text-sm">
                {errors.residential_address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <Input
              {...register("nationality", {
                required: "Nationality is required",
              })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm">
                {errors.nationality.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <Input
              {...register("designation", {
                required: "Designation is required",
              })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm">
                {errors.designation.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className=" w-full col-span-full"
            variant="orange"
          >
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DirectorForm;
