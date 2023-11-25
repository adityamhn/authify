import Logs from "@/components/pages/dashboard/Logs";
import { useServerSide } from "@/services/constants";
import { getAllLogs } from "@/services/project.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import React from "react";

const LogsPage = async ({ params, searchParams }) => {
  const { projectKey } = params;
  const { q, starting_after, ending_before } = searchParams;

  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
    getAllLogs({
      rsid: rsid?.value,
      projectKey,
      q,
      starting_after,
      ending_before,
    })
  );

  const revalidate = async () => {
    "use server";
    revalidatePath(`/${projectKey}/logs`, "page");
  };

  return (
    <Logs
      projectKey={projectKey}
      logs={data?.logs}
      first={data?.first}
      last={data?.last}
      revalidate={revalidate}
    />
  );
};

export default LogsPage;
