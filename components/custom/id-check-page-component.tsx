// components/custom/id-check-page-component.tsx
"use client";

import { Fragment } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CustomerVerificationForm from "./customer-verification-form";
import { useSession } from "next-auth/react";
import logger from "@/lib/logger/logger";

type VerificationItem = {
  id: number;
  dob: string;
  roles: string[];
  status: "verified" | "unverified";
};

type IDCheckComponentProps = {
  verifications: { data: VerificationItem[] };
  token: string;
};

const statusCopy = {
  verified: {
    label: "Verified",
    tone: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  unverified: {
    label: "Unverified",
    tone: "text-rose-600 bg-rose-50 border-rose-200",
  },
};

const checkLabels = [
  "ID Verification",
  "Liveness",
  "Address & Mortality",
  "Sanctions & PEPs",
];

export default function IDCheckComponent({
  verifications,
  token,
}: IDCheckComponentProps) {
  const { data: session } = useSession() as any;
  logger.info(session, "session");
  logger.info(token, "token");

  const hasVerifications = verifications?.data?.length > 0;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Identity Checks
        </h1>
        <p className="text-sm text-slate-500">
          Monitor the status of each verification check or submit a new
          verification request.
        </p>
      </header>

      {hasVerifications ? (
        <section className="space-y-6">
          {verifications.data.map((item) => {
            const statusMeta = statusCopy[item.status] ?? statusCopy.unverified;
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl"
              >
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Verification
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 text-sm text-slate-500">
                      <span className="font-medium text-slate-600">
                        DOB:{" "}
                        <span className="font-normal text-slate-500">
                          {new Date(item.dob).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="hidden sm:block">•</span>
                      <span className="font-medium text-slate-600">
                        Roles:{" "}
                        <span className="font-normal text-slate-500">
                          {item.roles.join(", ")}
                        </span>
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusMeta.tone}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-slate-100">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Check Name
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-600">
                      {checkLabels.map((label, idx) => (
                        <Fragment key={`${item.id}-${idx}`}>
                          <tr className="hover:bg-slate-50">
                            <td className="px-5 py-4 font-medium text-slate-700">
                              {label}
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-slate-500">
                                {item.status === "verified"
                                  ? "Complete"
                                  : "Pending"}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    className="rounded-lg border border-orange/20 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange/60 transition hover:border-orange/30 hover:bg-orange-100"
                                  >
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Edit Verification
                                    </DialogTitle>
                                  </DialogHeader>
                                  <CustomerVerificationForm
                                    token={token}
                                    mode="update"
                                    verification={item}
                                  />
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-orange/30 bg-orange/10 p-16 text-center shadow-inner">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">
              No Verification Yet
            </h2>
            <p className="text-sm text-slate-500">
              {session?.customer?.first_name} {session?.customer?.last_name},
              start the verification process by submitting your documents.
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-orange px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange/30 transition hover:bg-orange-600">
                Add ID Verification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add ID Verification</DialogTitle>
              </DialogHeader>
              <CustomerVerificationForm token={token} />
            </DialogContent>
          </Dialog>
        </section>
      )}
    </main>
  );
}
