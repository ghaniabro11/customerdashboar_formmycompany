"use client";  // Ensure this component is client-side

import logger from "@/lib/logger/logger";
import { useSession } from "next-auth/react";

const CompanyInboxContent = () => {
  const { data: session, status } = useSession(); // Use `status` to check the session state

  logger.info(session);

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading state
  }

  if (!session) {
    return <div>You need to be logged in to view this page</div>;
  }

  return <div>Welcome to the page, {session.user?.name}</div>;
};

export default CompanyInboxContent;


