import Tenants from "@/components/pages/dashboard/Tenants";
import { useServerSide } from "@/services/constants";
import { getAllTenants } from "@/services/tenant.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import React from "react";

const TenantsPage = async ({ params, searchParams }) => {
  const { projectKey } = params;
  const { q, starting_after, ending_before } = searchParams;

  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
    getAllTenants({
      rsid: rsid?.value,
      projectKey,
      q,
      starting_after,
      ending_before,
    })
  );

  const revalidate = async () => {
    "use server";
    revalidatePath(`/${projectKey}/tenants`, "page");
  };

  return (
    <Tenants
      projectKey={projectKey}
      revalidate={revalidate}
      tenants={data?.tenants}
      totalTenants={data?.totalTenants}
      first={data?.first}
      last={data?.last}
    />
  );
};

export default TenantsPage;
