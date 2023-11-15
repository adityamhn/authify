"use client"

import React, { useRef, useState } from 'react'
import styles from "@/styles/pages/Dashboard.module.scss"
import { Col, Dropdown, Row, message } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import { PlusOutlined } from '@ant-design/icons'
import AddButtonDropdown from '@/components/common/dashboard/AddButtonDropdown'
import UserTable from '@/components/common/tables/UserTable'
import { MdOutlineContentCopy, MdOutlineModeEdit } from 'react-icons/md'
import { BiTrash } from 'react-icons/bi'
import AddUserModal from '@/components/common/modals/users/AddUserModal'
import UploadModal from '@/components/common/modals/UploadModal'
import DuplicateUserModal from '@/components/common/modals/users/DuplicateUserModal'
import AssignRoleModal from '@/components/common/modals/users/AssignRoleModal'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { deleteUser } from '@/services/userDirectory.service'
import { showConfirm } from '@/components/common/modals/ConfirmModal'
import { encodeQuery } from '@/utils/queryParser'
import { useMutation } from 'react-query'
import AdvanceSearchBar from '@/components/common/AdvanceSearchBar'

const Users = ({ projectKey, users, revalidate, totalUsers, first, last }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get("q")
  const searchRef = useRef(null)
  const [messageApi, contextHolder] = message.useMessage();

  // Modals
  const [addUserModal, setAddUserModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [duplicateUserModal, setDuplicateUserModal] = useState(false);
  const [assignRoleModal, setAssignRoleModal] = useState(false);

  const dropdownItems = [
    {
      label: "Add User Manually",
      onClick: () => setAddUserModal(true)
    },
    {
      label: "Import JSON or CSV",
      onClick: () => setUploadModal(true)
    }

  ]

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      messageApi.open({
        content: "User deleted successfully",
        key: "deleteUser",
        type: "success"
      })
      revalidate()
    },
    onError: (error) => {
      messageApi.open({
        content: error?.response?.data?.message || "Something went wrong",
        key: "deleteUser",
        type: "error"
      })
    }
  })



  const userTableDropdownItems = [
    {
        label: "Edit User",
        icon: <MdOutlineModeEdit className={styles.icon} />,
        onClick: (record) => setAddUserModal({ ...record, edit: true })
    },
    {
        label: "Delete User",
        icon: <BiTrash className={styles.icon} />,
        onClick: (record) => showConfirm({
          title: `Are you sure you want to delete this user?`,
          content: `This will delete the '${record.userName}' user. This action cannot be undone.`,
          onOk: async () => {
            messageApi.open({
              content: "Deleting user...",
              key: "deleteUser",
              type: "loading"
            })
            await deleteUserMutation.mutateAsync({ userDirectoryId: record._id, projectKey })
          },
          loading: deleteUserMutation.isLoading
        }),
    },
    {
        label: "Duplicate User",
        icon: <MdOutlineContentCopy className={styles.icon} />,
        onClick: () => setDuplicateUserModal(true)
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
        <h1 className={styles.heading}>Users</h1>
      </div>
      <Row align="middle" justify="space-between" className={styles.actionsContainer}>
        <Col className={styles.filterContainer}>
        <AdvanceSearchBar
              defaultValue={q ?? ""}
              searchRef={searchRef}
              placeholder="Search Users ( filters : role, tenant )"
              className={styles.filterbar}
              onSearch={handleSearch}
              allowClear
              filterType="user"
              onClear={handleSearchClear} />
        </Col>
        <Col>
          <Dropdown trigger={["click"]} dropdownRender={() => <AddButtonDropdown items={dropdownItems} />}>
            <div>
              <PrimaryButton size="small" icon={<PlusOutlined />}>Add User</PrimaryButton>
            </div>
          </Dropdown>
        </Col>
      </Row>
      <div className={styles.dashboardTableContainer}>
        <UserTable userTableDropdownItems={userTableDropdownItems} setAssignRoleModal={setAssignRoleModal} users={users} totalUsers={totalUsers} first={first} last={last}  />
      </div>


       {/* Modals */}
       <AddUserModal visible={addUserModal} setVisible={setAddUserModal} setAssignRoleModal={setAssignRoleModal} projectKey={projectKey} revalidate={revalidate} />
       <UploadModal visible={uploadModal} setVisible={setUploadModal} type="user" label="User" />

       <DuplicateUserModal visible={duplicateUserModal} setVisible={setDuplicateUserModal} />
       <AssignRoleModal visible={assignRoleModal} setVisible={setAssignRoleModal} />
    </div>
    </>
  )
}

export default Users