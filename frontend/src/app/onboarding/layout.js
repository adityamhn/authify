import Redirect from "@/components/common/constants/Redirect";
import { checkUserLoginStatus } from "@/services/auth.service";
import { useServerSide } from "@/services/constants";
import { cookies } from "next/headers";
import React from "react";

const OnboardingLayout = async ({ children }) => {
  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const { data, error } = await useServerSide(() =>
    checkUserLoginStatus({ rsid: rsid?.value })
  );

  if (data?.isLoggedIn && data?.onboarding?.completed) {
    return <Redirect to="default" projectKey={data.projectKey} />;
  }

  if ((error && !error?.isLoggedIn) || !data?.isLoggedIn) {
    return <Redirect to="/auth" />;
  }

  return <div>{children}</div>;
};

export default OnboardingLayout;
