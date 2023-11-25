import { Row, Table } from 'antd'
import React from 'react'
import styles from '@/styles/components/Table.module.scss'
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io'
import PrimaryButton from '../PrimaryButton'
import moment from 'moment'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { RiExternalLinkFill } from 'react-icons/ri'


const LogsTable = ({ logs, first, last, projectKey }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const router = useRouter();
    const q = searchParams.get("q");

    const columns = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (date) => <>{moment.unix(date).format("lll")}</>
        },
        {
            title: 'User Key',
            dataIndex: 'userKey',
            key: 'userKey',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Resource',
            dataIndex: 'resourceKey',
            key: 'resourceKey',
        },
        {
            title: 'Tenant',
            dataIndex: 'tenantKey',
            key: 'tenantKey',
        },
        {
            title: 'Decision',
            dataIndex: 'decision',
            key: 'decision',
            render: (decision) => <>{decision === "allowed" ? <div className={styles.allowedDecision}>ALLOWED</div> : decision === "denied" ? <div className={styles.deniedDecision}>DENIED</div> : null}</>
        },
    ];


    const handleNextPage = () => {
        if (last) return;
        router.push(`${pathname}?${q ? "q=" + q + "&" : ""}starting_after=${logs[logs.length - 1]._id}`)
    }

    const handlePreviousPage = () => {
        if (first) return;
        router.push(`${pathname}?${q ? "q=" + q + "&" : ""}ending_before=${logs[0]._id}`)
    }


    const handleLogDetailsClick = (type, key) => {
        if (type === "user") router.push(`/${projectKey}/users?q=${key}`);
        else if (type === "resource") router.push(`/${projectKey}/resources?q=${key}`);
        else if (type === "tenant") router.push(`/${projectKey}/tenants?q=${key}`);
        else if (type === "action") {
            const [resourceKey, action] = key.split(":");
            router.push(`/${projectKey}/resources?q=action%3D${action} ${resourceKey}`);
        }
    }

    return (
        <div className={`${styles.resourceTableContainer} ${styles.logsTableContainer}`}>
            <Table
                dataSource={logs}
                columns={columns}
                pagination={false}
                rowClassName={(record, index) => (index % 2 === 0 ? styles.evenRow : styles.oddRow)}
                expandable={{
                    expandedRowRender: (record, index) => (
                        <>
                            <div key={record._id} className={`${styles.logDetailsContainer} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}>
                                <div className={styles.logDetails}>
                                    <div className={styles.logDetailsHeading}>Details</div>
                                    <Row align="middle" className={styles.logDetailsRow}>
                                        <div className={styles.logDetailsSection}>
                                            <div className={styles.logDetailsKey}>Timestamp</div>
                                            <div className={styles.logDetailsValue}>{moment.unix(record.timestamp).format("lll") || "-"}</div>
                                        </div>
                                        <div className={styles.logDetailsSection}>
                                            <div className={styles.logDetailsKey}>User key</div>
                                            <div onClick={() => handleLogDetailsClick("user", record.userKey)} className={styles.logDetailsClickableValue}>{record.userKey || "-"}<RiExternalLinkFill /></div>
                                        </div>
                                        <div className={styles.logDetailsSection}>
                                            <div className={styles.logDetailsKey}>Resource</div>
                                            <div onClick={() => handleLogDetailsClick("resource", record.resourceKey)} className={styles.logDetailsClickableValue}>{record.resourceKey || "-"}<RiExternalLinkFill /></div>
                                        </div>
                                        <div className={styles.logDetailsSection}>
                                            <div className={styles.logDetailsKey}>Action performed</div>
                                            <div onClick={() => handleLogDetailsClick("action", `${record.resourceKey}:${record.action}`)} className={styles.logDetailsClickableValue}>{record.action || "-"}<RiExternalLinkFill /></div>
                                        </div>
                                        <div className={styles.logDetailsSection}>
                                            <div className={styles.logDetailsKey}>Tenant</div>
                                            <div onClick={() => handleLogDetailsClick("tenant", record.tenantKey)} className={styles.logDetailsClickableValue}>{record.tenantKey || "-"}<RiExternalLinkFill /></div>
                                        </div>
                                        <div className={styles.logDetailsSection}>
                                            <div className={styles.logDetailsKey}>decision taken</div>
                                            <div className={styles.logDetailsValue}>{record.decision === "allowed" ? <div className={styles.allowedDecision}>ALLOWED</div> : record.decision === "denied" ? <div className={styles.deniedDecision}>DENIED</div> : '-'}</div>
                                        </div>
                                        <div className={styles.logDetailsSection}>
                                            <div className={styles.logDetailsKey}>Reason</div>
                                            <div className={styles.logDetailsValue}>{record.reason || "-"}</div>
                                        </div>
                                    </Row>
                                </div>
                                <div className={styles.logDetails}>
                                    <div className={styles.logDetailsHeading}>Metadata</div>
                                    <Row align="middle" className={styles.logDetailsRow}>
                                        {(record.metadata && Object.keys(record.metadata).length > 0) ? Object.keys(record.metadata).map((key, index) => (
                                            <>
                                                <div key={index} className={styles.logDetailsSection}>
                                                    <div className={styles.logDetailsKey}>{key}</div>
                                                    <div className={styles.logDetailsValue}>{record.metadata[key]}</div>
                                                </div>
                                            </>
                                        )) : "-"}
                                    </Row>
                                </div>
                            </div>
                        </>),
                    expandIcon: ({ expanded, onExpand, record }) => {
                        if (expanded) {
                            return <div className={styles.expandButton} onClick={e => onExpand(record, e)}><IoMdArrowDropdown /></div>
                        } else {
                            return <div className={styles.expandButton} onClick={e => onExpand(record, e)}><IoMdArrowDropright /></div>
                        }
                    },
                }} />
            <Row align="middle" justify="end" className={styles.tableFooter}>
                <div className={styles.paginationButtons}>
                    <PrimaryButton buttonType="pagination" disabled={!!first} onClick={handlePreviousPage}>Previous</PrimaryButton>
                    <PrimaryButton buttonType="pagination" disabled={!!last} onClick={handleNextPage}>Next</PrimaryButton>
                </div>
            </Row>
        </div>
    )
}

export default LogsTable