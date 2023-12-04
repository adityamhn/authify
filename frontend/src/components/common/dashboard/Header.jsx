"use client";

import React, { useEffect } from 'react'
import styles from "@/styles/components/Header.module.scss"
import { Breadcrumb, Col, Dropdown, Row } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import ProfileDropdown from './ProfileDropdown';
import { RiNotification2Line } from "react-icons/ri";
import ManageAccountModal from '../modals/ManageAccountModal';
import { useMutation } from 'react-query';
import { logoutUser } from '@/services/auth.service';
import { logout } from '@/store/user.slice';
import { useDispatch } from 'react-redux';
import { showConfirm } from '../modals/ConfirmModal';

const Header = ({ projectKey, user, projects }) => {
  const pathname = usePathname()
  const dispatch = useDispatch();
  const router = useRouter();

  const [manageAccountModalVisible, setManageAccountModalVisible] = React.useState(false);
  const [currentProject, setCurrentProject] = React.useState(projects.find(project => project.projectKey === projectKey));

  const logoutMutation = useMutation(logoutUser, {
    onSuccess: () => {
      dispatch(logout())
      router.push("/auth")
    }
  })

  const handleLogout = () => {
    showConfirm({
      title: `Are you sure you want to logout?`,
      okText: `Logout`,
      onOk: async () => {
        await logoutMutation.mutateAsync()
      },
    })
  }



  const breadcrumbMap = {
    [`/${projectKey}`]: ['Dashboard'],
    [`/${projectKey}/resources`]: ['Resources'],
    [`/${projectKey}/roles`]: ['Roles'],
    [`/${projectKey}/tenants`]: ['Tenants'],
    [`/${projectKey}/users`]: ['Users'],
    [`/${projectKey}/policy`]: ['Policy Editor'],
    [`/${projectKey}/logs`]: ['Activity Logs'],
    [`/${projectKey}/settings`]: ['Settings'],
    [`/${projectKey}/settings/team`]: ['Settings', 'Team'],
    [`/${projectKey}/settings/keys`]: ['Settings', 'Api keys'],


  };

  useEffect(() => {
    setCurrentProject(projects.find(project => project.projectKey === projectKey));
  }, [projects, projectKey]);



  return (
    <>
      <Row align="middle" justify="space-between" className={styles.headerContainer}>
        <Col className={styles.headerLeft}>
          <Breadcrumb
            items={[
              {
                title: `${currentProject?.projectName}`,
              },
              ...breadcrumbMap[pathname].map((title) => ({ title })),

            ]}
          />
        </Col>
        <Col className={styles.headerRight}>
          <Row
            align="middle"
            style={{
              gap: "1.5rem"
            }}
          >
            {/* <div className={`${styles.profileDropdownContainer} ${styles.notificationContainer}`}>
              <Dropdown trigger={["click"]} >
                <Row align="middle" className={styles.profileDropdownButton}>
                  <RiNotification2Line className={styles.downArrow} />
                </Row>
              </Dropdown>
            </div> */}
            <div className={styles.profileDropdownContainer}>
              <Dropdown trigger={["click"]} dropdownRender={() => <ProfileDropdown handleLogout={handleLogout} setManageAccountModalVisible={setManageAccountModalVisible} />}>
                <Row align="middle" className={styles.profileDropdownButton}>
                  <div className={styles.userName}>{user?.name}</div>
                  <MdOutlineKeyboardArrowDown className={styles.downArrow} />
                </Row>
              </Dropdown>
            </div>
          </Row>
        </Col>
      </Row>


      {/* Modals */}
      <ManageAccountModal visible={manageAccountModalVisible} setVisible={setManageAccountModalVisible} handleLogout={handleLogout} />
    </>

  )
}

export default Header