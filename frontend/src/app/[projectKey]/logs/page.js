import Logs from "@/components/pages/dashboard/Logs";
import { useServerSide } from "@/services/constants";
import { getAllLogs } from "@/services/project.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import React from "react";

const LogsPage = async ({ params, searchParams }) => {
  const { projectKey } = params;
  const { q, starting_after, ending_before, start_date, end_date } = searchParams;

  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
    getAllLogs({
      rsid: rsid?.value,
      projectKey,
      q,
      starting_after,
      ending_before,
      start_date,
      end_date,
    })
  );

  const revalidate = async () => {
    "use server";
    revalidatePath(`/${projectKey}/resources`, "page");
  };

  console.log(data);
  return (
    <Logs
      projectKey={projectKey}
      logs={data?.logs}
      totalLogs={data?.totalLogs}
      first={data?.first}
      last={data?.last}
      startDate={data?.startDate}
      endDate={data?.endDate}
      revalidate={revalidate}
    />
  );
};

export default LogsPage;
