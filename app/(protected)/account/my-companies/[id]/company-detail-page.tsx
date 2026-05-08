"use client";

import CompanyUpdateForm from "@/components/custom/company-update-form";
import DataTable from "@/components/custom/datatable";
import DirectorForm from "@/components/custom/director-form";
import DocumentForm from "@/components/custom/documentform";
import { EmailDetailsDialog } from "@/components/custom/email-body";
import MemberForm from "@/components/custom/memberform";
import PSCForm from "@/components/custom/pscform";
import SecretaryForm from "@/components/custom/secretaries";
import { Button } from "@/components/ui/button";
import {
  CompanyDetail,
  Director,
  DirectorDocument,
  Member,
  Order,
  Psc,
  Secretary,
} from "@/constants/types";
import { axiosInstance } from "@/lib/axios";
import logger from "@/lib/logger/logger";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export interface CompanyInboxEmail {
  id: number;
  company_id: number;
  from_email: string;
  to_email: string;
  subject: string;
  sent_at: string;
  received_at: null | string;
}

export interface DocumentByAdmin {
  id: number;
  file_type: string;
  file_path: string;
  file_url: string;
}

const CompanyDetailComponent = ({
  company,
  token,
  companyInboxEmails,
  documentsByAdmin,
}: {
  company: CompanyDetail;
  token: string;
  companyInboxEmails: CompanyInboxEmail[];
  documentsByAdmin: DocumentByAdmin[];
}) => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpen = (id: number) => {
    setSelectedId(id);
    setOpen(true);
  };

  const router = useRouter();
  const orders: Order[] = Array.isArray(company?.order)
    ? company?.order
    : company?.order
    ? [company?.order]
    : [];

  const deleteDocument = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/customer/companies/documents/${id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.refresh();
      toast.success(response.data.message || "Document deleted successfully");
    } catch (error: any) {
      logger.error(error, "Failed to delete document");
      logger.error(error.response.data.message || "Failed to delete document");
    }
  };
  const deleteMemberAtIncorporation = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/customer/companies/members-at-incorporation-delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.refresh();
      toast.success(response.data.message || "Document deleted successfully");
    } catch (error: any) {
      logger.error(error, "Failed to delete document");
      logger.error(error.response.data.message || "Failed to delete document");
    }
  };
  const deleteDirector = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/customer/companies/directors_delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.refresh();
      toast.success(response.data.message || "Document deleted successfully");
    } catch (error: any) {
      logger.error(error, "Failed to delete document");
      logger.error(error.response.data.message || "Failed to delete document");
    }
  };
  const deletePeopleWithSignificantControl = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/customer/companies/people-with-significant-control-delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.refresh();
      toast.success(response.data.message || "Document deleted successfully");
    } catch (error: any) {
      logger.error(error, "Failed to delete document");
      logger.error(error.response.data.message || "Failed to delete document");
    }
  };
  const deleteSecretary = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/customer/companies/secretaries_delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.refresh();
      toast.success(response.data.message || "Document deleted successfully");
    } catch (error: any) {
      logger.error(error, "Failed to delete document");
      logger.error(error.response.data.message || "Failed to delete document");
    }
  };
  return (
    <main>
      <div className="flex items-center justify-between gap-6">
        <h1>{company?.company_name}</h1>
        <CompanyUpdateForm token={token} company={company} />
      </div>

      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Company Details
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {company?.company_name || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Company Type</h3>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {company?.company_type || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Company Registration Number
            </h3>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {company?.registration_number || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Company Status
            </h3>
            <p
              className={`mt-1 text-base font-semibold capitalize ${
                company?.status === "submitted"
                  ? "text-green-600"
                  : company?.status === "draft"
                  ? "text-red-600"
                  : "text-gray-900"
              }`}
            >
              {company?.status || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between my-2 gap-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Directors
          </h2>
          <DirectorForm
            mode="create"
            directorData={null}
            companyId={id as string}
            token={token}
          />
        </div>

        <DataTable
          data={company?.directors}
          columns={[
            {
              header: "Name",
              accessor: (row: Director) =>
                `${row?.first_name} ${row?.last_name}`,
            },
            {
              header: "Nationality",
              accessor: (row: Director) => row?.nationality || "N/A",
            },
            {
              header: "Action",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <DirectorForm
                    mode="update"
                    directorData={row as Director}
                    companyId={id as string}
                    token={token}
                  />
                  <Button
                    variant="destructive"
                    onClick={async () =>
                      await deleteDirector(row?.id?.toString() || "")
                    }
                    className="text-xs"
                    size={"sm"}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          total={company?.directors?.length}
          pagination={false}
          rowKey={(row: Director) => row?.id}
        />
      </div>
      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between my-2 gap-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Company Members
          </h2>
          <MemberForm
            mode="create"
            memberData={null}
            companyId={id as string}
            token={token}
          />
        </div>

        <DataTable
          data={company?.members}
          columns={[
            {
              header: "Name",
              accessor: (row: Member) =>
                `${row?.title} ${row?.first_name} ${row?.last_name}`,
            },
            {
              header: "Shares",
              accessor: (row: Member) => row?.shares || "N/A",
            },
            {
              header: "Service Address",
              accessor: (row: Member) => row?.service_address || "N/A",
            },
            {
              header: "Action",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <MemberForm
                    mode="update"
                    memberData={row as Member}
                    companyId={id as string}
                    token={token}
                  />
                  <Button
                    variant="destructive"
                    onClick={async () =>
                      await deleteMemberAtIncorporation(row?.id?.toString() || "")
                    }
                    className="text-xs"
                    size={"sm"}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          total={company?.members?.length}
          pagination={false}
          rowKey={(row: Member) => row?.id}
        />
      </div>
      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between my-2 gap-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Company Documents
          </h2>
          <DocumentForm
            mode="create"
            documentData={null}
            companyId={id as string}
            token={token}
          />
        </div>

        <DataTable
          data={company?.documents}
          columns={[
            {
              header: "Document Name",
              accessor: (row: DirectorDocument) => row?.document_name || "N/A",
            },
            {
              header: "File Path",
              accessor: (row: DirectorDocument) => (
                <a
                  href={row?.file_path}
                  target="_blank"
                  className="text-blue-500"
                >
                  View File
                </a>
              ),
            },
            {
              header: "Action",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <DocumentForm
                    mode="update"
                    documentData={row as DirectorDocument}
                    companyId={id as string}
                    token={token}
                  />
                  <Button
                    variant="destructive"
                    onClick={async () =>
                      await deleteDocument(row?.id?.toString() || "")
                    }
                    className="text-xs"
                    size={"sm"}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          total={company?.documents?.length}
          pagination={false}
          rowKey={(row: DirectorDocument) => row?.id}
        />
      </div>

      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between my-2 gap-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Documents by Admin
          </h2>
        </div>

        <DataTable
          data={documentsByAdmin}
          columns={[
            {
              header: "Document Name",
              accessor: (row: DocumentByAdmin) => row?.file_type || "N/A",
            },
            {
              header: "File",
              accessor: (row: DocumentByAdmin) => (
                <a
                  href={row?.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View File
                </a>
              ),
            },
          ]}
          total={documentsByAdmin?.length || 0}
          pagination={false}
          rowKey={(row: DocumentByAdmin) => row?.id}
        />
      </div>
      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between my-2 gap-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            People with Significant Control (PSC){" "}
          </h2>
          <PSCForm
            mode="create"
            pscData={null}
            companyId={id as string}
            token={token}
          />
        </div>

        <DataTable
          data={company?.pscs}
          columns={[
            {
              header: "Name",
              accessor: (row: Psc) => `${row?.first_name} ${row?.last_name}`,
            },
            {
              header: "Control Type",
              accessor: (row: Psc) => row?.control_type || "N/A",
            },
            {
              header: "Action",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <PSCForm
                    mode="update"
                    pscData={row as Psc}
                    companyId={id as string}
                    token={token}
                  />
                  <Button
                    variant="destructive"
                    onClick={async () =>
                      await deletePeopleWithSignificantControl(
                        row?.id?.toString() || ""
                      )
                    }
                    className="text-xs"
                    size={"sm"}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          total={company?.pscs?.length}
          pagination={false}
          rowKey={(row: Psc) => row?.id}
        />
      </div>

      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between my-2 gap-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Secretaries
          </h2>
          <SecretaryForm
            companyId={id as string}
            mode="create"
            secretaryData={null}
            token={token}
          />
        </div>

        <DataTable
          data={company?.secretaries}
          columns={[
            {
              header: "Name",
              accessor: (row: Secretary) =>
                `${row?.title} ${row?.first_name} ${row?.last_name}`,
            },
            {
              header: "Nationality",
              accessor: (row: Secretary) => row?.nationality || "N/A",
            },
            {
              header: "Designation",
              accessor: (row: Secretary) => row?.designation || "N/A",
            },
            {
              header: "Nationality",
              accessor: (row: Secretary) => row?.nationality || "N/A",
            },
            {
              header: "Service Address",
              accessor: (row: Secretary) => row?.service_address || "N/A",
            },
            {
              header: "Residential Address",
              accessor: (row: Secretary) => row?.residential_address || "N/A",
            },
            {
              header: "Action",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <SecretaryForm
                    mode="update"
                    secretaryData={row as Secretary}
                    companyId={id as string}
                    token={token}
                  />
                  <Button
                    variant="destructive"
                    onClick={async () =>
                      await deleteSecretary(row?.id?.toString() || "")
                    }
                    className="text-xs"
                    size={"sm"}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          total={company?.secretaries?.length}
          pagination={false}
          rowKey={(row: Secretary) => row?.id}
        />
      </div>
      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between my-2 gap-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Order History
          </h2>
        </div>

        <DataTable
          data={orders}
          columns={[
            {
              header: "Order Date",
              accessor: (row: Order) => `${row?.order_date || "N/A"}`,
            },
            {
              header: "Order Number",
              accessor: (row: Order) => row?.order_number || "N/A",
            },
          ]}
          total={company?.order?.length}
          pagination={false}
          rowKey={(row: Order) => row?.customer_id}
        />
      </div>
      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between my-2 gap-5">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Company Inbox
          </h2>
        </div>

        <DataTable
          data={companyInboxEmails as CompanyInboxEmail[]}
          columns={[
            {
              header: "From Email",
              accessor: (row: CompanyInboxEmail) => row?.from_email || "N/A",
            },
            {
              header: "To Email",
              accessor: (row: CompanyInboxEmail) => row?.to_email || "N/A",
            },
            {
              header: "Subject",
              accessor: (row: CompanyInboxEmail) => row?.subject || "N/A",
            },
            {
              header: "Sent At",
              accessor: (row: CompanyInboxEmail) =>
                new Date(row?.sent_at).toLocaleDateString() || "N/A",
            },
            {
              header: "Status",
              accessor: (row: CompanyInboxEmail) => (
                <div
                  className={
                    row?.received_at ? "text-green-600" : "text-red-600"
                  }
                >
                  {row?.received_at ? "Read" : "Unread"}
                </div>
              ),
            },
            {
              header: "Action",
              accessor: (row: CompanyInboxEmail) => (
                <Button variant="orange" onClick={() => handleOpen(row?.id)}>
                  View
                </Button>
              ),
            },
          ]}
          total={company?.order?.length}
          pagination={false}
          rowKey={(row: CompanyInboxEmail) => row?.id}
        />
      </div>
      <EmailDetailsDialog
        token={token}
        emailId={selectedId}
        open={open}
        onOpenChange={setOpen}
      />
    </main>
  );
};

export default CompanyDetailComponent;
