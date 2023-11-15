import GeneralSettings from '@/components/pages/settings/GeneralSettings'
import { getUserDetails } from '@/services/user.service';
import { cookies } from 'next/headers';
import React from 'react'

const SettingsPage = async ({params}) => {
  const cookieStore = cookies();
  const { projectKey } = params;
  const rsid = cookieStore.get("rsid");

  const user = await getUserDetails({ rsid: rsid?.value });

  return <GeneralSettings projectKey={projectKey} projects={user.projects} />
}

export default SettingsPage