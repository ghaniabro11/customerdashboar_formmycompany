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
  const router = useRouter();

  useEffect(() => {
    if (mode === "update" && directorData) {
      Object.entries(directorData).forEach(([key, value]) => {
        setValue(key as keyof Director, value as never);
      });
    }
  }, [mode, directorData, setValue]);

  const onSubmit: SubmitHandler<Director> = async (data) => {
    const url =
      mode === "create"
        ? `${BACKEND_URL}/customer/companies/directors`
        : `${BACKEND_URL}/customer/companies/directors/${directorData?.id}`;

    try {
      const res = await axios({
        method: "POST",
        url,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
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
          {mode === "create" ? "Appoint" : "Update"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold">
          {mode === "create" ? "Appoint Director" : "Update Director"}
        </DialogTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 mt-4"
        >
          {/* PERSON */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Person
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium">
                  Title *
                </label>

                <select
                  {...register("title", {
                    required: "Title is required",
                  })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>

                {errors.title && (
                  <p className="text-red-500 text-sm">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium">
                  First Name *
                </label>

                <Input
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                />

                {errors.first_name && (
                  <p className="text-red-500 text-sm">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-sm font-medium">
                  Middle Name
                </label>

                <Input {...register("middle_name")} />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium">
                  Last Name *
                </label>

                <Input
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                />

                {errors.last_name && (
                  <p className="text-red-500 text-sm">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Email for Personal Code from Companies House
                </label>

                <Input
                  type="email"
                  {...register("email")}
                />
              </div>

              {/* Personal Code */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Personal Code
                </label>

                <Input {...register("personal_code")} />
              </div>
            </div>
          </div>

          {/* SERVICE ADDRESS */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Service Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium">
                  Building name/number *
                </label>

                <Input
                  {...register("service_building", {
                    required: "Building is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Street *
                </label>

                <Input
                  {...register("service_street", {
                    required: "Street is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Address 3
                </label>

                <Input {...register("service_address_3")} />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Town *
                </label>

                <Input
                  {...register("service_town", {
                    required: "Town is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Country *
                </label>

                <Input
                  {...register("service_country", {
                    required: "Country is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Postcode *
                </label>

                <Input
                  {...register("service_postcode", {
                    required: "Postcode is required",
                  })}
                />
              </div>
            </div>
          </div>

          {/* RESIDENTIAL ADDRESS */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Residential Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium">
                  Building name/number *
                </label>

                <Input
                  {...register("residential_building", {
                    required: "Building is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Street *
                </label>

                <Input
                  {...register("residential_street", {
                    required: "Street is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Address 3
                </label>

                <Input {...register("residential_address_3")} />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Town *
                </label>

                <Input
                  {...register("residential_town", {
                    required: "Town is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  County
                </label>

                <Input {...register("residential_county")} />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Postcode *
                </label>

                <Input
                  {...register("residential_postcode", {
                    required: "Postcode is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Country *
                </label>

                <Input
                  {...register("residential_country", {
                    required: "Country is required",
                  })}
                />
              </div>
            </div>
          </div>

          {/* OTHER */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Other
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium">
                  Nationality *
                </label>

                <Input
                  {...register("nationality", {
                    required: "Nationality is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Occupation *
                </label>

                <Input
                  {...register("occupation", {
                    required: "Occupation is required",
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Country Of Residence *
                </label>

                <Input
                  {...register("country_of_residence", {
                    required:
                      "Country of residence is required",
                  })}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="orange"
          >
            {mode === "create" ? "Appoint" : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DirectorForm;