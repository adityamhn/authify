"use server";

import React from "react";
import styles from "@/styles/pages/Auth.module.scss";
import { useServerSide } from "@/services/constants";
import { cookies } from "next/headers";
import { checkUserLoginStatus } from "@/services/auth.service";
import Redirect from "@/components/common/constants/Redirect";

const AuthLayout = async ({ children }) => {
  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");
  const { data, error } = await useServerSide(() =>
    checkUserLoginStatus({ rsid: rsid?.value })
  );

  if (data?.isLoggedIn) {
    if (data?.onboarding?.completed) {
      return <Redirect to="default" projectKey={data.projectKey} />;
    } else {
      return <Redirect to="/onboarding" />;
    }
  }



  return (
    <div className={styles.authContainer}>
      <div className={styles.authWrapper}>{children}</div>
    </div>
  );
};

export default AuthLayout;
