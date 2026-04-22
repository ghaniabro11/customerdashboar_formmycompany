// components/custom/customer-verification-form.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { BACKEND_URL } from "@/constants/url";

type FormMode = "create" | "update";

type FormData = {
  dob: string;
  roles: { value: string }[];
  id_verification: FileList;
  liveness: FileList;
  address_morality: FileList;
  sanction_peps: FileList;
};

type CustomerVerificationFormProps = {
  token: string;
  mode?: FormMode;
  verification?: {
    id: number;
    dob?: string;
    roles?: string[];
  };
  onSuccess?: () => void;
};

const formatDobForInput = (dob?: string) => {
  if (!dob) return "";
  const parsed = new Date(dob);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

export default function CustomerVerificationForm({
  token,
  mode = "create",
  verification,
  onSuccess,
}: CustomerVerificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const defaultRoles = useMemo(() => {
    if (verification?.roles?.length) {
      return verification.roles.map((role) => ({ value: role }));
    }
    return [{ value: "" }];
  }, [verification?.roles]);

  const { register, handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      dob: formatDobForInput(verification?.dob),
      roles: defaultRoles,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roles",
  });

  useEffect(() => {
    reset({
      dob: formatDobForInput(verification?.dob),
      roles: defaultRoles,
    });
  }, [verification?.dob, defaultRoles, reset]);

  const submitLabel =
    mode === "update" ? "Save Changes" : "Submit Verification";
  const titleLabel =
    mode === "update" ? "Edit Verification" : "Customer Verification";
  const descriptionLabel =
    mode === "update"
      ? "Update any outdated information and re-upload documents if necessary."
      : "Provide the required details and supporting documents to start the verification process.";

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("dob", data.dob);

    data.roles.forEach((role, index) => {
      if (role.value.trim()) {
        formData.append(`roles[${index}]`, role.value.trim());
      }
    });

    if (data.id_verification?.length) {
      formData.append("id_verification", data.id_verification[0]);
    }
    if (data.liveness?.length) {
      formData.append("liveness", data.liveness[0]);
    }
    if (data.address_morality?.length) {
      formData.append("address_morality", data.address_morality[0]);
    }
    if (data.sanction_peps?.length) {
      formData.append("sanction_peps", data.sanction_peps[0]);
    }

    const endpoint =
      mode === "update" && verification?.id
        ? `${BACKEND_URL}/customer-verifications/${verification.id}`
        : `${BACKEND_URL}/customer-verifications`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      await res.json();

      setMessage({
        type: "success",
        text:
          mode === "update"
            ? "Verification updated successfully."
            : "Verification submitted successfully.",
      });

      if (mode === "create") {
        reset({
          dob: "",
          roles: [{ value: "" }],
          id_verification: undefined as unknown as FileList,
          liveness: undefined as unknown as FileList,
          address_morality: undefined as unknown as FileList,
          sanction_peps: undefined as unknown as FileList,
        });
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong, please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl ">
      <header className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {mode === "update" ? "Update" : "New"} submission
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">{titleLabel}</h2>
        <p className="text-sm text-slate-500">{descriptionLabel}</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="grid gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Date of Birth
            </label>
            <input
              type="date"
              {...register("dob", { required: true })}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white"
            />
            <p className="text-xs text-slate-400">
              Must match the customer’s legal documentation.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Roles</label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <input
                    type="text"
                    {...register(`roles.${index}.value` as const, {
                      required: true,
                    })}
                    placeholder="e.g. Director"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm text-red-500 hover:text-red-600"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-2 w-max rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200"
              onClick={() => append({ value: "" })}
            >
              + Add Role
            </Button>
          </div>
        </section>

        <section className="grid gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Document Uploads
          </h3>

          <div className="grid gap-4">
            <label className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-sm font-medium text-slate-700">
                ID Verification
              </span>
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .pdf"
                {...register("id_verification")}
                className="text-xs text-slate-500 file:mr-4 file:rounded file:border-0 file:bg-orange-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-orange-600"
              />
              <span className="text-xs text-slate-400">
                Government-issued photo ID (PDF, JPG, PNG, RTF).
              </span>
            </label>

            <label className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-sm font-medium text-slate-700">
                Liveness
              </span>
              <input
                accept=".jpg, .jpeg, .png, .pdf"
                type="file"
                {...register("liveness")}
                className="text-xs text-slate-500 file:mr-4 file:rounded file:border-0 file:bg-orange-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-orange-600"
              />
              <span className="text-xs text-slate-400">
                Upload a selfie or liveness capture.
              </span>
            </label>

            <label className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-sm font-medium text-slate-700">
                Address & Mortality
              </span>
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .pdf"
                {...register("address_morality")}
                className="text-xs text-slate-500 file:mr-4 file:rounded file:border-0 file:bg-orange-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-orange-600"
              />
              <span className="text-xs text-slate-400">
                Recent proof of address or mortality check results.
              </span>
            </label>

            <label className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-sm font-medium text-slate-700">
                Sanctions & PEPs
              </span>
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .pdf"
                {...register("sanction_peps")}
                className="text-xs text-slate-500 file:mr-4 file:rounded file:border-0 file:bg-orange-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-orange-600"
              />
              <span className="text-xs text-slate-400">
                Upload sanctioned party screening results.
              </span>
            </label>
          </div>
        </section>

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {loading
              ? mode === "update"
                ? "Saving..."
                : "Submitting..."
              : submitLabel}
          </Button>

          {message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200"
                  : "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
