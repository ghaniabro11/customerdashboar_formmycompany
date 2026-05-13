"use client";
import { CompanyDetail } from "@/constants/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import logger from "@/lib/logger/logger";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/constants/url";

type FormData = {
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

const CompanyUpdateForm = ({
  token,
  company,
}: {
  token: string;
  company: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      company_name: company.company_name || "",
      company_type: company.company_type || "",
      business_activity: company.business_activity || "",
      country: company.country || "",
      city: company.city || "",
      contact_phone: company.contact_phone || "",
      contact_email: company.contact_email || "",
      registered_address: company.registered_address || "",
      postcode: company.postcode || "",
    },
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpen = () => setOpen(!open);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Get token from cookies

      // Get company ID
      const companyId = company?.id;
      if (!companyId) {
        toast.error("Company ID not found.");
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("company_name", data.company_name);
      formData.append("company_type", data.company_type);
      formData.append("business_activity", data.business_activity);
      formData.append("country", data.country);
      formData.append("city", data.city);
      formData.append("contact_phone", data.contact_phone);
      formData.append("contact_email", data.contact_email);
      formData.append("registered_address", data.registered_address);
      formData.append("postcode", data.postcode);

      // Make API request
      const response = await axios.post(
        `${BACKEND_URL}/customer/company_update/${companyId}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      logger.info("Company update response:", response.data);
      toast.success(response.data?.message || "Company updated successfully");
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      logger.error("Failed to update company:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update company. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Company</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Company</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <Input
            {...register("company_name", {
              required: "Company Name is required",
            })}
            disabled
            type="text"
            placeholder="Company Name"
          />
          {errors.company_name && <span>{errors.company_name.message}</span>}

          <Input
            {...register("company_type", {
              required: "Company Type is required",
            })}
            disabled
            type="text"
            placeholder="Company Type"
          />
          {errors.company_type && <span>{errors.company_type.message}</span>}

          <Input
            {...register("business_activity", {
              required: "Business Activity is required",
            })}
            type="text"
            placeholder="Business Activity"
          />
          {errors.business_activity && (
            <span>{errors.business_activity.message}</span>
          )}

          <Input
            {...register("country", { required: "Country is required" })}
            type="text"
            placeholder="Country"
          />
          {errors.country && <span>{errors.country.message}</span>}

          <Input
            {...register("city", { required: "City is required" })}
            type="text"
            placeholder="City"
          />
          {errors.city && <span>{errors.city.message}</span>}

          <Input
            {...register("contact_phone", {
              required: "Phone number is required",
            })}
            type="text"
            placeholder="Contact Phone"
          />
          {errors.contact_phone && <span>{errors.contact_phone.message}</span>}

          <Input
            {...register("contact_email", { required: "Email is required" })}
            type="email"
            placeholder="Contact Email"
          />
          {errors.contact_email && <span>{errors.contact_email.message}</span>}

          <Input
            {...register("registered_address", {
              required: "Address is required",
            })}
            type="text"
            placeholder="Registered Address"
          />
          {errors.registered_address && (
            <span>{errors.registered_address.message}</span>
          )}

          <Input
            {...register("postcode", { required: "Postcode is required" })}
            type="text"
            placeholder="Postcode"
          />
          {errors.postcode && <span>{errors.postcode.message}</span>}

          <div className="col-span-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="orange" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyUpdateForm;
