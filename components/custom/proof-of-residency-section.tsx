"use client";

import DataTable from "@/components/custom/datatable";
import ProofOfResidencyForm from "@/components/custom/proof-of-residency-form";
import { Button } from "@/components/ui/button";
import { ProofOfResidency } from "@/constants/types";


interface Props {
  data: ProofOfResidency[];
  companyId: string;
  token: string;
  deleteProofOfResidency: (id: string) => Promise<void>;
}

const ProofOfResidencySection = ({
  data,
  companyId,
  token,
  deleteProofOfResidency,
}: Props) => {
  return (
    <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between my-2 gap-5">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Proof Of Residency Documents
        </h2>

        <ProofOfResidencyForm
          mode="create"
          proofData={null}
          companyId={companyId}
          token={token}
        />
      </div>
      <div className="mb-6 rounded-xl border bg-gray-50 p-5 text-sm text-gray-700">
        <p className="mb-4">
          As part of our ID verification process, we also require
          <strong> 2 x proof of address documents.</strong>
        </p>

        <p className="mb-2 font-semibold">
          Please provide the following from the list below:
        </p>

        <ul className="mb-4 list-disc pl-6">
          <li>Two different documents from Group A, or</li>
          <li>
            One document from Group A and one document from Group B
          </li>
        </ul>

        <div className="overflow-x-auto">
          <table className="w-full border border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">
                  Group A
                </th>
                <th className="border p-3 text-left">
                  Group B
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-3">
                  Bank or Building Society Statement
                </td>
                <td className="border p-3">
                  Credit Card Statement
                </td>
              </tr>

              <tr>
                <td className="border p-3">
                  Water, Gas, or Electricity Bill
                </td>
                <td className="border p-3">
                  TV Licence Fee
                </td>
              </tr>

              <tr>
                <td className="border p-3">
                  Internet, Cable, or Landline Bill
                </td>
                <td className="border p-3">
                  Government Tax Notice
                </td>
              </tr>

              <tr>
                <td className="border p-3">
                  Mortgage Statement
                </td>
                <td className="border p-3">
                  Insurance Policy (Home, Life, or Medical)
                </td>
              </tr>

              <tr>
                <td className="border p-3"></td>
                <td className="border p-3">
                  Certificate of Residence
                  <br />
                  <span className="italic text-gray-500">
                    (must be typed; handwritten not accepted)
                  </span>
                </td>
              </tr>

              <tr>
                <td className="border p-3"></td>
                <td className="border p-3">
                  Council Tax or Municipality Bill
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-medium">
          Once you have the documents ready, please upload them in
          their respecting Group Type when click on ‘Add Document’.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  {/* Group A */}
  <div>
    <h3 className="mb-3 text-lg font-semibold text-gray-800">
      Group A Documents
    </h3>

    <DataTable
      data={
        data?.filter(
          (item) => item?.document_group === "A"
        ) || []
      }
      columns={[
        {
          header: "Document Title",
          accessor: (row: ProofOfResidency) =>
            row?.document_title || "N/A",
        },
        {
          header: "File",
          accessor: (row: ProofOfResidency) => (
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
        {
          header: "Action",
          accessor: (row: ProofOfResidency) => (
            <div className="flex items-center gap-2">
              <ProofOfResidencyForm
                mode="update"
                proofData={row}
                companyId={companyId}
                token={token}
              />

              <Button
                variant="destructive"
                onClick={async () =>
                  await deleteProofOfResidency(
                    row?.id?.toString()
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
      total={
        data?.filter(
          (item) => item?.document_group === "A"
        )?.length || 0
      }
      pagination={false}
      rowKey={(row: ProofOfResidency) => row?.id || 0}
    />
  </div>

  {/* Group B */}
  <div>
    <h3 className="mb-3 text-lg font-semibold text-gray-800">
      Group B Documents
    </h3>

    <DataTable
      data={
        data?.filter(
          (item) => item?.document_group === "B"
        ) || []
      }
      columns={[
        {
          header: "Document Title",
          accessor: (row: ProofOfResidency) =>
            row?.document_title || "N/A",
        },
        {
          header: "File",
          accessor: (row: ProofOfResidency) => (
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
        {
          header: "Action",
          accessor: (row: ProofOfResidency) => (
            <div className="flex items-center gap-2">
              <ProofOfResidencyForm
                mode="update"
                proofData={row}
                companyId={companyId}
                token={token}
              />

              <Button
                variant="destructive"
                onClick={async () =>
                  await deleteProofOfResidency(
                    row?.id?.toString()
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
      total={
        data?.filter(
          (item) => item?.document_group === "B"
        )?.length || 0
      }
      pagination={false}
      rowKey={(row: ProofOfResidency) => row?.id || 0}
    />
  </div>
</div>
    </div>
  );
};

export default ProofOfResidencySection;