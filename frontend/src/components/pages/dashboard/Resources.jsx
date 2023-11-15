"use client";

import React, { useRef, useState } from 'react'
import styles from "@/styles/pages/Dashboard.module.scss"
import { Col, Dropdown, Row, message } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import { PlusOutlined } from '@ant-design/icons'
import AddButtonDropdown from '@/components/common/dashboard/AddButtonDropdown'
import AddResourceModal from '@/components/common/modals/resources/AddResourceModal'
import UploadModal from '@/components/common/modals/UploadModal'
import ResourceTable from '@/components/common/tables/ResourceTable'
import {MdOutlineModeEdit } from 'react-icons/md';
import { BiTrash } from 'react-icons/bi';
import { PiCirclesThreeBold } from 'react-icons/pi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { encodeQuery } from '@/utils/queryParser';
import { showConfirm } from '@/components/common/modals/ConfirmModal';
import { addAction, deleteAction, deleteResource } from '@/services/resource.service';
import { useMutation } from 'react-query';
import AdvanceSearchBar from '@/components/common/AdvanceSearchBar';

const Resources = ({ projectKey, resources, revalidate, totalResources, first, last }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get("q")
  const searchRef = useRef(null)
  const [messageApi, contextHolder] = message.useMessage();

  // Modals
  const [addResourceModal, setAddResourceModal] = useState(false)
  const [uploadModal, setUploadModal] = useState(false)


  const dropdownItems = [
    {
      label: "Add Resource Manually",
      onClick: () => setAddResourceModal(true)
    },
    {
      label: "Import JSON or CSV",
      onClick: () => setUploadModal(true)
    }
  ]

  const deleteResourceMutation = useMutation(deleteResource, {
    onSuccess: () => {
      messageApi.open({
        content: "Resource deleted successfully",
        key: "deleteResource",
        type: "success"
      })
      revalidate()
    },
    onError: (error) => {
      messageApi.open({
        content: error?.response?.data?.message || "Something went wrong",
        key: "deleteResource",
        type: "error"
      })
    }
  })

  const deleteActionMutation = useMutation(deleteAction, {
    onSuccess: () => {
      messageApi.open({
        content: "Action deleted successfully",
        key: "deleteAction",
        type: "success"
      })
      revalidate()
    },
    onError: (error) => {
      messageApi.open({
        content: error?.response?.data?.message || "Something went wrong",
        key: "deleteAction",
        type: "error"
      })
    }
  })

  const addActionMutation = useMutation(addAction, {
    onSuccess: () => {
      messageApi.open({
        content: "Action added successfully",
        key: "addAction",
        type: "success"
      })
      revalidate()
    },
    onError: (error) => {
      messageApi.open({
        content: error?.response?.data?.message || "Something went wrong",
        key: "addAction",
        type: "error"
      })
    }
  })


  const resourceDropdownItems = [
    {
      label: "Edit Resource",
      icon: <MdOutlineModeEdit className={styles.icon} />,
      onClick: (record) => setAddResourceModal({ ...record, edit: true })
    },
    {
      label: "Delete Resource",
      icon: <BiTrash className={styles.icon} />,
      onClick: (record) => showConfirm({
        title: `Are you sure you want to delete this resource?`,
        content: `This will delete the '${record.resourceName}' resource and all its actions associated with it. This action cannot be undone.`,
        onOk: async () => {
          messageApi.open({
            content: "Deleting resource...",
            key: "deleteResource",
            type: "loading"
          })
          await deleteResourceMutation.mutateAsync({ resourceId: record._id, projectKey })
        },
        loading: deleteResourceMutation.isLoading
      }),
    },
    {
      label: "View Roles",
      icon: <PiCirclesThreeBold className={styles.icon} />,
      onClick: (record) => {
        router.push(`/${projectKey}/roles?q=${encodeQuery(`resource=${record.resourceKey}`)}`)
      }
    }
  ]

  const actionsDropdownItems = [
    {
      label: "Delete Action",
      icon: <BiTrash className={styles.icon} />,
      onClick: (record) => showConfirm({
        title: `Are you sure you want to delete this action?`,
        content: `This will delete the '${record.action}' action from the resource '${record.actionKey.split(":")[0]}'. This cannot be undone.`,
        onOk: async () => {
          messageApi.open({
            content: "Deleting Action...",
            key: "deleteAction",
            type: "loading"
          })
          await deleteActionMutation.mutateAsync({ resourceId: record.resourceId, action: record.action, projectKey })
        },
        loading: deleteActionMutation.isLoading
      })
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

  const handleAddAction = async ({
    resourceId,
    action,
  }) => {
    messageApi.open({
      content: "Adding Action...",
      key: "addAction",
      type: "loading"
    })
    await addActionMutation.mutateAsync({ resourceId, action, projectKey })
  }


  return (
    <>
      {contextHolder}
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Resources</h1>
        </div>
        <Row align="middle" justify="space-between" className={styles.actionsContainer}>
          <Col className={styles.filterContainer}>
            <AdvanceSearchBar
              defaultValue={q ?? ""}
              searchRef={searchRef}
              placeholder="Search Resources ( filters : action, tenant )"
              className={styles.filterbar}
              onSearch={handleSearch}
              allowClear
              filterType="resource"
              onClear={handleSearchClear} />
          </Col>
          <Col>
            <Dropdown trigger={["click"]} dropdownRender={() => <AddButtonDropdown items={dropdownItems} />}>
              <div>
                <PrimaryButton size="small" icon={<PlusOutlined />}>Add Resource</PrimaryButton>
              </div>
            </Dropdown>
          </Col>
        </Row>
        <div className={styles.dashboardTableContainer}>
          <ResourceTable resourceDropdownItems={resourceDropdownItems} actionsDropdownItems={actionsDropdownItems} handleAddAction={handleAddAction} addActionLoading={addActionMutation.isLoading} resources={resources} totalResources={totalResources} first={first} last={last} />
        </div>


        {/* Modals */}
        <AddResourceModal visible={addResourceModal} setVisible={setAddResourceModal} projectKey={projectKey} revalidate={revalidate} />
        <UploadModal visible={uploadModal} setVisible={setUploadModal} type="resource" label="Resource" />
      </div>
    </>

  )
}

export default Resources