"use client";

import DataTable from "@/components/custom/datatable";
import ProofOfResidencyForm from "@/components/custom/proof-of-residency-form";
import { Button } from "@/components/ui/button";

interface ProofOfResidency {
  id: number;
  document_title: string;
  file_url: string;
}

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

      <DataTable
        data={data || []}
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
                  href={row?.file_path}
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
        total={data?.length || 0}
        pagination={false}
        rowKey={(row: ProofOfResidency) => row?.id || 0}
      />
    </div>
  );
};

export default ProofOfResidencySection;