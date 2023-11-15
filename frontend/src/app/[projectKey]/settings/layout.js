"use client";

import React from "react";
import styles from "@/styles/pages/Dashboard.module.scss";
import { Segmented } from "antd";
import { usePathname, useRouter } from "next/navigation";

const SettingsLayout = ({ children, params}) => {
  const router = useRouter();
  const {projectKey} = params;
  const pathname = usePathname();

  console.log("pathname",pathname.split("/"));


  const handleTabChange = (key) => {
    router.push(`/${projectKey}/settings/${key}`);
  };

  return (
    <div>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Settings</h1>
        </div>
        <Segmented
          options={[
            {
              label: "General",
              value: "",
            },
            {
              label: "Team",
              value: "team",
            },
            {
              label: "Api keys",
              value: "keys",
            },
          ]}
          className={styles.settingsTabs}
          onChange={handleTabChange}
          defaultValue={pathname.split("/")[3]}
        />
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
