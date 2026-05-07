"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BACKEND_URL } from "@/constants/url";
import logger from "@/lib/logger/logger";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";



interface DocumentFormProps {
  mode: "create" | "update";
  documentData: any; // Adjust the type to match your document data structure
  companyId: string;
  token: string;
}

const DocumentForm = ({
  mode = "create",
  documentData = null,
  companyId,
  token,
}: DocumentFormProps) => {

  const [loading, setLoading] = useState(false); // ✅ MOVE HERE
  const [open, setOpen] = useState(false);

  const router = useRouter(); 
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>(); // Adjust form type to match your data structure
  const DOCUMENT_TYPES = [
    { value: "incorporation_certificate", label: "Incorporation Certificate" },
    { value: "memorandum_of_association", label: "Memorandum of Association" },
    { value: "articles_of_association", label: "Articles of Association" },
    { value: "shareholder_agreement", label: "Shareholder Agreement" },
    { value: "director_appointment", label: "Director Appointment" },
    { value: "passport", label: "Passport" },
    { value: "local_id", label: "Local ID" },
    { value: "driving_license", label: "Driving License" },
    { value: "permanent_residency_certificate", label: "Permanent Residency Certificate" },
    { value: "Utility Bill", label: "Utility Bill" },
    // add the rest from backend config
  ];
  // Set form values for update mode
  useEffect(() => {
    if (mode === "update" && documentData) {
      setValue("document_type", documentData.document_type);
      // setValue("remarks", documentData.remarks);
    }
  }, [mode, documentData, setValue]);

  // Handle form submission
  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true); // START loader
  
    const url =
      mode === "create"
        ? `${BACKEND_URL}/customer/companies/documents`
        : `${BACKEND_URL}/customer/companies/documents/${documentData?.id}`;
  
    const formData = new FormData();
    formData.append("company_id", companyId);
    formData.append("document_type", data.document_type);
  
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }
  
    try {
      const res = await axios.post(url, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      setOpen(false);
      router.refresh();
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
  
        if (errors.file) {
          alert(errors.file[0]);
        }
  
        console.log(errors);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false); // STOP loader (important)
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
          {mode === "create" ? "Upload Document" : "Update Document"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-xl font-semibold">
          {mode === "create" ? "Upload Document" : "Update Document"}
        </DialogTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 mt-4 grid grid-cols-2 gap-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Type
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("document_type", {
                required: "Document type is required",
              })}
            >
              <option value="">Select…</option>
              {DOCUMENT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.document_type && (
              <p className="text-red-500 text-sm">
                {errors.document_type?.message as string}
              </p>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <Input
              {...register("remarks", {
                required: "Remarks are required",
              })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.remarks && (
              <p className="text-red-500 text-sm">
                {errors.remarks.message as string}
              </p>
            )}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Document
            </label>
            <Input
              type="file"
              // accept="application/pdf"
              {...register("file", {
                required: "File is required",
              })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.file && (
              <p className="text-red-500 text-sm">
                {errors.file.message as string}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full col-span-full flex items-center justify-center gap-2"
            variant="orange"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Uploading...
              </>
            ) : (
              mode === "create" ? "Upload" : "Update"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentForm;
