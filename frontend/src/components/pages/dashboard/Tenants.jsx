"use client"

import React, { useRef, useState } from 'react'
import styles from "@/styles/pages/Dashboard.module.scss"
import { Col, Dropdown, Row, message } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import { PlusOutlined } from '@ant-design/icons'
import AddButtonDropdown from '@/components/common/dashboard/AddButtonDropdown'
import AddTenantModal from '@/components/common/modals/tenants/AddTenantModal'
import UploadModal from '@/components/common/modals/UploadModal'
import TenantTable from '@/components/common/tables/TenantTable'
import { MdOutlineModeEdit } from 'react-icons/md'
import { BiTrash } from 'react-icons/bi'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { encodeQuery } from '@/utils/queryParser'
import { deleteTenant } from '@/services/tenant.service'
import { useMutation } from 'react-query'
import { showConfirm } from '@/components/common/modals/ConfirmModal'
import AdvanceSearchBar from '@/components/common/AdvanceSearchBar'

const Tenants = ({ projectKey, revalidate, tenants, totalTenants, first, last }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get("q")
  const searchRef = useRef(null)
  const [messageApi, contextHolder] = message.useMessage();

  // Modals
  const [addTenantModal, setAddTenantModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);


  const dropdownItems = [
    {
      label: "Add Tenant Manually",
      onClick: () => setAddTenantModal(true)
    },
    {
      label: "Import JSON or CSV",
      onClick: () => setUploadModal(true)
    }

  ]

  const deleteTenantMutation = useMutation(deleteTenant, {
    onSuccess: () => {
      messageApi.open({
        content: "Tenant deleted successfully",
        key: "deleteTenant",
        type: "success"
      })
      revalidate()
    },
    onError: (error) => {
      messageApi.open({
        content: error?.response?.data?.message || "Something went wrong",
        key: "deleteTenant",
        type: "error"
      })
    }
  })

  const tenantTableDropdownItems = [
    {
      label: "Edit Tenant",
      icon: <MdOutlineModeEdit className={styles.icon} />,
      onClick: (record) => setAddTenantModal({ ...record, edit: true })
    },
    {
      label: "Delete Tenant",
      icon: <BiTrash className={styles.icon} />,
      onClick: (record) => showConfirm({
        title: `Are you sure you want to delete this tenant?`,
        content: `This will delete the '${record.tenantName}' tenant and all its users, roles and resources associated with it. This action cannot be undone.`,
        onOk: async () => {
          messageApi.open({
            content: "Deleting tenant...",
            key: "deleteTenant",
            type: "loading"
          })
          await deleteTenantMutation.mutateAsync({ tenantId: record._id, projectKey })
        },
        loading: deleteTenantMutation.isLoading
      }),
    },

  ]

  const handleSearch = (clear) => {
    const q = searchRef.current?.input?.value;
    const encodedQ = encodeQuery(q)
    router.push(`${pathname}?q=${encodedQ}`)
  }

  const handleSearchClear = () => {
    router.push(`${pathname}`)
  }

  return (
    <>
      {contextHolder}
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Tenants</h1>
        </div>
        <Row align="middle" justify="space-between" className={styles.actionsContainer}>
          <Col className={styles.filterContainer}>
            <AdvanceSearchBar
              defaultValue={q ?? ""}
              searchRef={searchRef}
              placeholder="Search Tenants ( filters : user )"
              className={styles.filterbar}
              onSearch={handleSearch}
              allowClear
              filterType="tenant"
              onClear={handleSearchClear} />
          </Col>
          <Col>
            <Dropdown trigger={["click"]} dropdownRender={() => <AddButtonDropdown items={dropdownItems} />}>
              <div>
                <PrimaryButton size="small" icon={<PlusOutlined />}>Add Tenant</PrimaryButton>
              </div>
            </Dropdown>
          </Col>
        </Row>
        <div className={styles.dashboardTableContainer}>
          <TenantTable tenantTableDropdownItems={tenantTableDropdownItems} tenants={tenants} totalTenants={totalTenants} first={first} last={last} />
        </div>


        {/* Modals */}
        <AddTenantModal visible={addTenantModal} setVisible={setAddTenantModal} projectKey={projectKey} revalidate={revalidate} />
        <UploadModal visible={uploadModal} setVisible={setUploadModal} type="tenant" label="Tenant" />
      </div>
    </>

  )
}

export default Tenants