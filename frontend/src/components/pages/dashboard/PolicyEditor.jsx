"use client";

import React, { useState } from 'react'
import styles from "@/styles/pages/Dashboard.module.scss"
import { Col, Row } from 'antd'
import PolicyTable from '@/components/common/tables/PolicyTable';
import AddResourceModal from '@/components/common/modals/resources/AddResourceModal';
import AddRoleModal from '@/components/common/modals/roles/AddRoleModal';
import FilterSelect from '@/components/common/FilterSelect';
import { usePathname, useRouter } from 'next/navigation';


const PolicyEditor = ({ projectKey, revalidate, policy, tenantsList }) => {
  const pathname = usePathname()
  const router = useRouter()

  // Modals
  const [addResourceModal, setAddResourceModal] = useState(false)
  const [addRoleModal, setAddRoleModal] = useState(false);


  const handleChangeTenant = (tenantKey) => {
    const validTenant = tenantsList?.find(tenant => tenant.tenantKey === tenantKey)

    if (!validTenant) {
      return
    }

    router.push(`${pathname}?tenant=${tenantKey}`)
  }


  return (
    <div className={`${styles.dashboardContainer} ${styles.policyDashboardContainer}`}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.heading}>Policy Editor</h1>
      </div>
      <Row align="middle" justify="space-between" className={styles.actionsContainer}>
        <Col className={styles.filterContainer}>
          <FilterSelect
            placeholder="Select a tenant"
            options={tenantsList?.map(tenant => ({ label: tenant.tenantName, value: tenant.tenantKey }))}
            defaultValue={policy?.tenantKey}
            onSelect={handleChangeTenant}
          />
        </Col>
      </Row>
      <div className={styles.dashboardTableContainer}>
        <PolicyTable
          projectKey={projectKey}
          setAddResourceModal={setAddResourceModal}
          setAddRoleModal={setAddRoleModal}
          policy={policy}
          revalidate={revalidate}
        />
      </div>


      {/* Modals */}
      <AddResourceModal visible={addResourceModal} setVisible={setAddResourceModal} projectKey={projectKey} revalidate={revalidate} />
      <AddRoleModal visible={addRoleModal} setVisible={setAddRoleModal} projectKey={projectKey} revalidate={revalidate} />

    </div>
  )
}

export default PolicyEditor