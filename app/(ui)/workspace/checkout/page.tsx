import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import WorkspaceCheckoutClient from "@/components/custom/workspace/workspace-checkout-client";

export default async function WorkspaceCheckoutPage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth?callbackUrl=/workspace/checkout");
  }

  return <WorkspaceCheckoutClient session={session} />;
}
