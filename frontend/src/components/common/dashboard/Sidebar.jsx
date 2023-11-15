"use client";

import React, { useEffect } from "react";
import styles from "@/styles/components/Sidebar.module.scss";
import { Avatar, Dropdown, Row } from "antd";
import { MdOutlineKeyboardArrowDown, MdOutlineDashboard } from "react-icons/md";
import { TbSettings } from "react-icons/tb";
import { PiStackSimpleBold, PiCirclesThreeBold, PiUsersBold, PiBuildingsBold, PiCodeSimpleBold, PiDatabase } from "react-icons/pi";
import { usePathname, useRouter } from "next/navigation";
import ProjectDropdown from "./ProjectDropdown";

const Sidebar = ({ projectKey, projects }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentProject, setCurrentProject] = React.useState(projects.find(project => project.projectKey === projectKey));

  const items = [
    {
      label: "",
      children: [
        {
          icon: <MdOutlineDashboard />,
          label: `Dashboard`,
          path: `/${projectKey}`,
        },
      ]
    },
    {
      label: "Features",
      children: [
        {
          icon: <PiStackSimpleBold />,
          label: `Resources`,
          path: `/${projectKey}/resources`,
        },
        {
          icon: <PiCirclesThreeBold />,
          label: `Roles`,
          path: `/${projectKey}/roles`,
        },
        {
          icon: <PiCodeSimpleBold />,
          label: `Policy Editor`,
          path: `/${projectKey}/policy`,
        },
        {
          icon: <PiUsersBold />,
          label: `Users`,
          path: `/${projectKey}/users`,
        },
        {
          icon: <PiBuildingsBold />,
          label: `Tenants`,
          path: `/${projectKey}/tenants`,
        },

      ]
    },
    {
      label: "Activity",
      children: [
        {
          icon: <PiDatabase />,
          label: `Activity Logs`,
          path: `/${projectKey}/logs`,
        },
      ]
    },
    {
      label: "Others",
      children: [
        {
          icon: <TbSettings />,
          label: `Settings`,
          path: `/${projectKey}/settings`,
        },
      ]
    },

  ];

  useEffect(() => {
    setCurrentProject(projects.find(project => project.projectKey === projectKey));
  }, [projects, projectKey]);


  const handleClick = (path) => {
    router.push(path);
  }

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarWrapper}>
        <div className={styles.projectSelectorContainer}>
          <Dropdown trigger={["click"]} dropdownRender={() => <ProjectDropdown projects={projects} currentProject={currentProject} />}>
            <Row align="middle" className={styles.projectSelectorButton}>
              <Avatar shape="square" className={styles.projectIcon}>{currentProject?.projectName[0]}</Avatar>
              <div className={styles.projectName}>{currentProject.projectName}</div>
              <MdOutlineKeyboardArrowDown className={styles.downArrow} />
            </Row>
          </Dropdown>
        </div>
        <div className={styles.sidebarItemsContainer}>
          {items.map((itemsType, index) => (
            <div className={styles.sidebarItemsType} key={`${itemsType}-${index}`}>
              <div className={styles.type}>{itemsType.label}</div>
              {itemsType.children.map((item, index) => (
                <Row
                  align="middle"
                  className={`${styles.sidebarItem} ${pathname === item.path && styles.activeItem}`}
                  onClick={() => handleClick(item.path)}
                  key={`${item.label}-${index}`}>
                  <div className={styles.sidebarItemIcon}>{item.icon}</div>
                  <div className={styles.sidebarItemLabel}>{item.label}</div>
                </Row>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
