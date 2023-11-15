import Users from '@/components/pages/dashboard/Users'
import { useServerSide } from '@/services/constants';
import { getAllUsers } from '@/services/userDirectory.service';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import React from 'react'

const UsersPage = async ({ params, searchParams }) => {
  const { projectKey } = params;
  const { q, starting_after, ending_before } = searchParams;

  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
    getAllUsers({
      rsid: rsid?.value,
      projectKey,
      q,
      starting_after,
      ending_before,
    })
  );

  const revalidate = async () => {
    "use server";
    revalidatePath(`/${projectKey}/users`, "page");
  };

  return <Users 
  projectKey={projectKey}
  users={data?.users}
  totalUsers={data?.totalUsers}
  first={data?.first}
  last={data?.last}
  revalidate={revalidate}
   />
}

export default UsersPage