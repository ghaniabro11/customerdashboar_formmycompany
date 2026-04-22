"use client";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Psc } from "@/constants/types";
import { BACKEND_URL } from "@/constants/url";
import logger from "@/lib/logger/logger";
import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

interface PSCProps {
  mode: "create" | "update";
  pscData: Psc | null;
  companyId: string;
  token: string;
}

const PSCForm = ({
  mode = "create",
  pscData = null,
  companyId,
  token,
}: PSCProps) => {
    const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Psc>();
  const router = useRouter();
  // Set form values for update mode
  useEffect(() => {
    if (mode === "update" && pscData) {
      setValue("title", pscData.title);
      setValue("first_name", pscData.first_name);
      setValue("last_name", pscData.last_name);
      setValue("service_address", pscData.service_address);
      setValue("residential_address", pscData.residential_address);
      setValue("nationality", pscData.nationality);
      setValue("designation", pscData.designation);
      setValue("company_id", pscData.company_id);
      setValue("control_type", pscData.control_type); // Added control_type
    }
  }, [mode, pscData, setValue]);
  logger.info(token, "token");

  // Handle form submission
  const onSubmit: SubmitHandler<Psc> = async (data) => {
    const url =
      mode === "create"
        ? `${BACKEND_URL}/customer/companies/people-with-significant-control`
        : `${BACKEND_URL}/customer/companies/people-with-significant-control/${pscData?.id}`;

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
          {mode === "create" ? "Create People with Significant Control" : "Update People with Significant Control"}
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
                {errors.designation?.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Control Type
            </label>
            <Input
              {...register("control_type", {
                required: "Control type is required",
              })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.control_type && (
              <p className="text-red-500 text-sm">
                {errors.control_type.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full col-span-full"
            variant="orange"
          >
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PSCForm;
