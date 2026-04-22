// components/email-details-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getCompanyInboxEmailDetail } from "@/apis";
import { axiosInstance } from "@/lib/axios";
import logger from "@/lib/logger/logger";
// types/email.ts
export type EmailAttachment = {
  id: number;
  company_inbox_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
};

export type EmailMeta = {
  id: number;
  company_inbox_id: number;
  email: string;
  created_at: string;
  updated_at: string;
};

export type EmailDetails = {
  id: number;
  company_id: number;
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  sent_at: string;
  received_at: string;
  created_at: string;
  updated_at: string;
  cc: EmailMeta[];
  bcc: EmailMeta[];
  attachments: EmailAttachment[];
};

export type EmailApiResponse = {
  data: EmailDetails;
};

type EmailDetailsDialogProps = {
  emailId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
};

export function EmailDetailsDialog({
  emailId,
  open,
  onOpenChange,
  token,
}: EmailDetailsDialogProps) {
  const [data, setData] = useState<EmailDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !emailId) return;

    const fetchEmail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get(
          `/company_inbox_detail/${emailId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        logger.info(res, "res");
        setData(res?.data?.data);
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [emailId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border border-slate-200 bg-white/90 backdrop-blur-sm">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <DialogTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
              {data?.id ?? "…"}
            </span>
            {data?.subject || "Email details"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Email communication details for this ticket.
          </DialogDescription>
        </DialogHeader>

        {/* Loading state */}
        {loading && (
          <div className="py-10 text-center text-sm text-slate-500">
            Loading email details…
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="py-6 rounded-md border border-red-200 bg-red-50 px-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {!loading && !error && data && (
          <div className="mt-4 space-y-6">
            {/* Top meta info */}
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  From
                </p>
                <p className="rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-slate-800">
                  {data.from_email}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  To
                </p>
                <p className="rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-slate-800">
                  {data.to_email}
                </p>
              </div>

              {data.cc?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    CC
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.cc.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {c.email}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.bcc?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    BCC
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.bcc.map((b) => (
                      <span
                        key={b.id}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
                      >
                        {b.email}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid gap-3 md:grid-cols-3 text-xs text-slate-500">
              <div className="space-y-0.5">
                <p className="font-medium text-slate-600">Sent at</p>
                <p>{new Date(data.sent_at).toLocaleString()}</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-slate-600">Received at</p>
                <p>{new Date(data.received_at).toLocaleString()}</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-slate-600">Last updated</p>
                <p>{new Date(data.updated_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Message
              </p>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 whitespace-pre-line">
                {data.body}
              </div>
            </div>

            {/* Attachments */}
            {data.attachments?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  Attachments
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.attachments.map((file) => (
                    <a
                      key={file.id}
                      href={`/${file.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-[10px] uppercase">
                        {file.file_type}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium group-hover:text-indigo-600">
                          {file.file_name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {file.file_size} KB
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
