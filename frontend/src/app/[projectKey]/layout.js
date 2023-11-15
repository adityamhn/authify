import Sidebar from "@/components/common/dashboard/Sidebar.jsx";
import React from "react";
import styles from "@/styles/pages/DashboardLayout.module.scss";
import Header from "@/components/common/dashboard/Header";
import Redirect from "@/components/common/constants/Redirect";
import { useServerSide } from "@/services/constants";
import { cookies } from "next/headers";
import { checkUserLoginStatus } from "@/services/auth.service";
import { getUserDetails } from "@/services/user.service";
import { checkValidProject } from "@/services/project.service";
import AntConfig from "@/components/common/constants/AntConfig";

const DashboardLayout = async ({ children, params }) => {
  const cookieStore = cookies();
  const { projectKey } = params;
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
    checkUserLoginStatus({ rsid: rsid?.value })
  );

  if (data?.isLoggedIn && !data?.onboarding?.completed) {
    return <Redirect to="/onboarding" />;
  }

  if ((error && !error?.isLoggedIn) || !data?.isLoggedIn) {
    return <Redirect to="/auth" />;
  }

  const user = await getUserDetails({ rsid: rsid?.value });
  const validProject = await checkValidProject({
    projectKey,
    rsid: rsid?.value,
  });

  return (
    <AntConfig>
      <div className={styles.dashboardLayoutContainer}>
        <Sidebar projectKey={projectKey} projects={user?.projects} />
        <div className={styles.dashboardLayout}>
          <Header
            projectKey={projectKey}
            user={user?.data}
            projects={user?.projects}
          />
          {children}
        </div>
      </div>
    </AntConfig>
  );
};

export default DashboardLayout;
