"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BACKEND_URL } from "@/constants/url";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProofOfResidency {
  id?: number;
  document_group: string;
  document_title?: string;
  file_url?: string;
}

interface Props {
  companyId: string;
  token: string;
  mode: "create" | "update";
  proofData: ProofOfResidency | null;
}

const ProofOfResidencyForm = ({
  companyId,
  token,
  mode,
  proofData,
}: Props) => {
  const [open, setOpen] = useState(false);

const GROUP_A_DOCUMENTS = [
  "Bank or Building Society Statement",
  "Water, Gas, or Electricity Bill",
  "Internet, Cable, or Landline Bill",
  "Mortgage Statement",
];

const GROUP_B_DOCUMENTS = [
  "Credit Card Statement",
  "TV Licence Fee",
  "Government Tax Notice",
  "Insurance Policy (Home, Life, or Medical)",
  "Certificate of Residence",
  "Council Tax or Municipality Bill",
];

const [groupType, setGroupType] = useState(
  proofData?.document_group || "A"
);

const [document_title, setTitle] = useState(
  proofData?.document_title || ""
);

  const [files, setFiles] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (mode === "create" && (!files || files.length === 0)) {
      toast.error("Please select file(s)");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("company_id", companyId);
      formData.append("document_group", groupType);
      formData.append("document_title", document_title);

      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("documents[]", file);
        });
      }

      const url =
        mode === "create"
          ? `${BACKEND_URL}/customer/companies/proof-of-residency/store`
          : `${BACKEND_URL}/customer/companies/proof-of-residency/update/${proofData?.id}`;

      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      toast.success(
        mode === "create"
          ? "Uploaded successfully"
          : "Updated successfully"
      );

      setOpen(false);

      setTitle("");
      setFiles(null);

      router.refresh();
    } catch (error: any) {
      console.log("UPLOAD ERROR:", error);
    
      if (error.response) {
        console.log("RESPONSE DATA:", error.response.data);
        console.log("STATUS:", error.response.status);
    
        toast.error(
          error.response.data.message ||
          JSON.stringify(error.response.data.errors) ||
          "Upload failed"
        );
      } else {
        toast.error("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button variant="orange">
            Add Document
          </Button>
        ) : (
          <Button size="sm">
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add Proof Of Residency"
              : "Update Proof Of Residency"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium">
              Group Type
            </label>

            <select
              value={groupType}
              onChange={(e) => {
                setGroupType(e.target.value);
                setTitle("");
              }}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="A">Group A</option>
              <option value="B">Group B</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">
              Document Type
            </label>

            <select
              value={document_title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">
                Select Document Type
              </option>

              {(groupType === "A"
                ? GROUP_A_DOCUMENTS
                : GROUP_B_DOCUMENTS
              ).map((doc) => (
                <option
                  key={doc}
                  value={doc}
                >
                  {doc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Upload Documents
            </label>

            <input
              type="file"
              multiple
              onChange={(e) =>
                setFiles(e.target.files)
              }
              required={mode === "create"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <Button
            type="submit"
            variant="orange"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : mode === "create"
              ? "Upload"
              : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProofOfResidencyForm;