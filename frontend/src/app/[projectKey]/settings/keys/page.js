import ApiKeysSettings from '@/components/pages/settings/ApiKeysSettings'
import { useServerSide } from '@/services/constants';
import { getAllApiKeys } from '@/services/project.service';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import React from 'react'

const SettingsApiKeys = async({params}) => {
  const { projectKey } = params;

  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
  getAllApiKeys({
    rsid: rsid?.value,
    projectKey,
  })
);

const revalidate = async () => {
  "use server";
  revalidatePath(`/${projectKey}/settings/keys`, "page");
};

  return <ApiKeysSettings apiKeys={data?.apiKeys} projectKey={projectKey} revalidate={revalidate} />
}

export default SettingsApiKeys