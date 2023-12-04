import { Button, Row, Table, Tooltip, message } from 'antd'
import React from 'react'
import styles from '@/styles/components/Table.module.scss'

import { RiDeleteBin6Line } from 'react-icons/ri'
import { MdOutlineContentCopy } from 'react-icons/md'
import moment from 'moment'
import { showConfirm } from '../modals/ConfirmModal'
import { useMutation } from 'react-query'
import { deleteApiKey } from '@/services/project.service'


const APIKeysTable = ({ apiKeys, revalidate, projectKey }) => {
    const [messageApi, contextHolder] = message.useMessage();


    const handleCopyApiKey = (key) => {
        navigator.clipboard.writeText(key)
        messageApi.success('API Key copied to clipboard')
    }

    const deleteApiKeyMutation = useMutation(deleteApiKey, {
        onSuccess: (data) => {
            messageApi.open({
                content: "Api key deleted successfully",
                key: "deleteApiKey",
                type: "success"
            })
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const handleDeleteApiKey = async (record) => {
        showConfirm({
            title: `Are you sure you want to delete this API Key?`,
            content: `This will delete the '${record.identifier}' API Key. This action cannot be undone.`,
            onOk: async () => {
                messageApi.open({
                    content: "Deleting Api Key...",
                    key: "deleteApiKey",
                    type: "loading"
                })
                await deleteApiKeyMutation.mutateAsync({ apiKeyId: record._id, projectKey })
            },
            loading: deleteApiKeyMutation.isLoading
        })
    }

    const columns = [
        {
            title: 'Identifier',
            dataIndex: 'identifier',
            key: 'identifier',
        },
        {
            title: 'API Key',
            dataIndex: 'key',
            key: 'key',
            render: (key) => <Row align="middle" className={styles.settingsApiKeySection}><Tooltip title={key}><div className={styles.apiKey}>{key}</div></Tooltip><MdOutlineContentCopy onClick={() => handleCopyApiKey(key)} className={styles.copyIcon} /></Row>
        },
        {
            title: 'Created on',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => <>{moment(date).format("ll")}</>
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => <Button className={`${styles.actionsButtonContainer} ${styles.settingsTableDeleteButton}`} icon={<RiDeleteBin6Line />} onClick={async () => await handleDeleteApiKey(record)} />
        }
    ]





    return (
        <>
            {contextHolder}
            <div className={`${styles.resourceTableContainer} ${styles.settingsTableContainer}`}>
                <Table
                    columns={columns}
                    dataSource={apiKeys}
                    pagination={false}
                />
            </div>
        </>
    )
}

export default APIKeysTable