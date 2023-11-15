import PolicyEditor from "@/components/pages/dashboard/PolicyEditor";
import { useServerSide } from "@/services/constants";
import { getTenantsListServerSide } from "@/services/tenant.service";
import { getUserPolicy } from "@/services/user.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import React from "react";

const Policy = async ({ params, searchParams }) => {
  const { projectKey } = params;
  const { tenant } = searchParams;

  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const data = await getUserPolicy({
    rsid: rsid?.value,
    projectKey,
    tenantKey: tenant,
  });

  const tenantsList = await getTenantsListServerSide({
    projectKey,
    rsid: rsid?.value,
  });

  const revalidate = async () => {
    "use server";
    revalidatePath(`/${projectKey}/policy`, "page");
  };

  return (
    <PolicyEditor
      tenantsList={tenantsList?.tenants}
      policy={data?.policy}
      projectKey={projectKey}
      revalidate={revalidate}
    />
  );
};

export default Policy;
