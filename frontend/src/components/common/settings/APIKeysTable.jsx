import { Button, Row, Table, Tooltip, message } from 'antd'
import React from 'react'
import styles from '@/styles/components/Table.module.scss'

import { RiDeleteBin6Line } from 'react-icons/ri'
import { MdOutlineContentCopy } from 'react-icons/md'
import moment from 'moment'


const APIKeysTable = ({ apiKeys }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const handleCopyApiKey = (key) => {
        navigator.clipboard.writeText(key)
        messageApi.success('API Key copied to clipboard')
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
            render: () => <Button className={`${styles.actionsButtonContainer} ${styles.settingsTableDeleteButton}`} icon={<RiDeleteBin6Line />} />
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