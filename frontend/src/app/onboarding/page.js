import React from "react";
import OnboardingPage from "@/components/pages/onboarding/OnboardingPage";
import { getUserOnboarding } from "@/services/onboarding.service";
import { cookies } from "next/headers";
import Redirect from "@/components/common/constants/Redirect";

const Onboarding = async () => {
  const cookieStore = cookies();
  const rsid = cookieStore.get("rsid");

  const data = await getUserOnboarding({ rsid: rsid?.value });

  if (data?.completed) {
    return <Redirect to="default" projectKey={data.projectKey} />;
  }

  return <OnboardingPage step={data.step} />;
};

export default Onboarding;
