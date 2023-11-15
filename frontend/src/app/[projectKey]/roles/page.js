import Roles from "@/components/pages/dashboard/Roles";
import { useServerSide } from "@/services/constants";
import { getAllRoles } from "@/services/role.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import React from "react";

const RolesPage = async ({ params, searchParams }) => {
  const { projectKey } = params;
  const { q, starting_after, ending_before } = searchParams;

  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
    getAllRoles({
      rsid: rsid?.value,
      projectKey,
      q,
      starting_after,
      ending_before,
    })
  );

  const revalidate = async () => {
    "use server";
    revalidatePath(`/${projectKey}/roles`, "page");
  };

  return (
    <Roles
      projectKey={projectKey}
      roles={data?.roles}
      totalRoles={data?.totalRoles}
      first={data?.first}
      last={data?.last}
      revalidate={revalidate}
    />
  );
};

export default RolesPage;
