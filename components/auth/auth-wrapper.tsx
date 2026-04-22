// components/AuthWrapper.tsx
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
  redirectTo?: string;
}

export default async function AuthWrapper({ 
  children, 
  redirectTo = "/auth" 
}: AuthWrapperProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
