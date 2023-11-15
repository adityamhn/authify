import LoginPage from "@/components/pages/auth/LoginPage";
import { getLoginRequestDetails } from "@/services/auth.service";
import React from "react";

const Login = async ({ searchParams }) => {
  const data = await getLoginRequestDetails(searchParams.u);

  return <LoginPage email={data?.email} />;
};

export default Login;
