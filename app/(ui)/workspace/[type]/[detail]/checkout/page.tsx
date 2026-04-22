import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import WorkspaceCheckoutClient from "@/components/custom/workspace/workspace-checkout-client";
import { fetchWorkSpaceDetail } from "@/apis";

interface PageProps {
  params: Promise<{ type: string; detail: string }>;
}

export default async function WorkspaceCheckoutPage({ params }: PageProps) {
  const { detail } = await params;
  
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth");
  }

  // Fetch workspace details
  const workspaceDetail = await fetchWorkSpaceDetail(detail);
  const workspaceData = workspaceDetail?.data || {};

  return (
    <WorkspaceCheckoutClient 
      workspaceId={detail}
      workspaceData={workspaceData}
      session={session}
    />
  );
}
