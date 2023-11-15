"use client"

import React, { useRef, useState } from 'react'
import styles from "@/styles/pages/Dashboard.module.scss"
import { Col, Dropdown, Row, message } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import { PlusOutlined } from '@ant-design/icons'
import UploadModal from '@/components/common/modals/UploadModal'
import AddButtonDropdown from '@/components/common/dashboard/AddButtonDropdown'
import AddRoleModal from '@/components/common/modals/roles/AddRoleModal'
import RoleTable from '@/components/common/tables/RoleTable'
// import DuplicateRoleModal from '@/components/common/modals/roles/DuplicateRoleModal'
import {  MdOutlineModeEdit } from 'react-icons/md'
import { BiTrash } from 'react-icons/bi'
import { LuUsers2 } from 'react-icons/lu'
import AttachResourcesModal from '@/components/common/modals/roles/AttachResourcesModal'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { deleteRole } from '@/services/role.service'
import { useMutation } from 'react-query'
import { showConfirm } from '@/components/common/modals/ConfirmModal'
import { encodeQuery } from '@/utils/queryParser'
import AdvanceSearchBar from '@/components/common/AdvanceSearchBar'


const Roles = ({ projectKey, roles, revalidate, totalRoles, first, last }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get("q")
  const searchRef = useRef(null)
  const [messageApi, contextHolder] = message.useMessage();

  // Modals
  const [addRoleModal, setAddRoleModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  // const [duplicateRoleModal, setDuplicateRoleModal] = useState(false);
  const [attachResourceModal, setAttachResourceModal] = useState(false);


  const dropdownItems = [
    {
      label: "Add Role Manually",
      onClick: () => setAddRoleModal(true)
    },
    {
      label: "Import JSON or CSV",
      onClick: () => setUploadModal(true)
    }

  ]

  const deleteRoleMutation = useMutation(deleteRole, {
    onSuccess: () => {
      messageApi.open({
        content: "Role deleted successfully",
        key: "deleteRole",
        type: "success"
      })
      revalidate()
    },
    onError: (error) => {
      messageApi.open({
        content: error?.response?.data?.message || "Something went wrong",
        key: "deleteRole",
        type: "error"
      })
    }
  })


  const roleTableDropdownItems = [
    {
      label: "Edit Role",
      icon: <MdOutlineModeEdit className={styles.icon} />,
      onClick: (record) => setAddRoleModal({ ...record, edit: true })
    },
    {
      label: "Delete Role",
      icon: <BiTrash className={styles.icon} />,
      onClick: (record) => showConfirm({
        title: `Are you sure you want to delete this role?`,
        content: `This will delete the '${record.roleName}' role and unassign the users with this role. This action cannot be undone.`,
        onOk: async () => {
          messageApi.open({
            content: "Deleting resource...",
            key: "deleteRole",
            type: "loading"
          })
          await deleteRoleMutation.mutateAsync({ roleId: record._id, projectKey })
        },
        loading: deleteRoleMutation.isLoading
      }),
    },
    {
      label: "View Users",
      icon: <LuUsers2 className={styles.icon} />,
      onClick: () => console.log("View Users")
    },
    // {
    //   label: "Duplicate Role",
    //   icon: <MdOutlineContentCopy className={styles.icon} />,
    //   onClick: (record) => setDuplicateRoleModal({ ...record })
    // },
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
          <h1 className={styles.heading}>Roles</h1>
        </div>
        <Row align="middle" justify="space-between" className={styles.actionsContainer}>
          <Col className={styles.filterContainer}>
            <AdvanceSearchBar
              defaultValue={q ?? ""}
              searchRef={searchRef}
              placeholder="Search Roles ( filters : resource, tenant )"
              className={styles.filterbar}
              onSearch={handleSearch}
              allowClear
              filterType="role"
              onClear={handleSearchClear} />
          </Col>
          <Col>
            <Dropdown trigger={["click"]} dropdownRender={() => <AddButtonDropdown items={dropdownItems} />}>
              <div>
                <PrimaryButton size="small" icon={<PlusOutlined />}>Add Role</PrimaryButton>
              </div>
            </Dropdown>
          </Col>
        </Row>
        <div className={styles.dashboardTableContainer}>
          <RoleTable roleTableDropdownItems={roleTableDropdownItems} setAttachResourceModal={setAttachResourceModal} roles={roles} totalRoles={totalRoles} first={first} last={last} />
        </div>



        {/* Modals */}
        <AddRoleModal visible={addRoleModal} setVisible={setAddRoleModal} projectKey={projectKey} revalidate={revalidate} />
        <UploadModal visible={uploadModal} setVisible={setUploadModal} type="role" label="Role" />
        {/* <DuplicateRoleModal visible={duplicateRoleModal} setVisible={setDuplicateRoleModal} projectKey={projectKey} revalidate={revalidate} /> */}
        <AttachResourcesModal visible={attachResourceModal} setVisible={setAttachResourceModal} projectKey={projectKey} revalidate={revalidate} />
      </div>
    </>
  )
}

export default Roles