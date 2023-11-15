import Resources from "@/components/pages/dashboard/Resources";
import { useServerSide } from "@/services/constants";
import { getAllResource } from "@/services/resource.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import React from "react";

const ResourcesPage = async ({ params, searchParams }) => {
  const { projectKey } = params;
  const { q, starting_after, ending_before } = searchParams;

  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
    getAllResource({ rsid: rsid?.value, projectKey, q, starting_after, ending_before })
  );


  const revalidate = async () => {
    "use server";
    revalidatePath(`/${projectKey}/resources`, "page");
  };

  return (
    <Resources
      projectKey={projectKey}
      resources={data?.resources}
      totalResources={data?.totalResources}
      first={data?.first}
      last={data?.last}
      revalidate={revalidate}
    />
  );
};

export default ResourcesPage;
