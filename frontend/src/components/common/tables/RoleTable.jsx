import { Button, Dropdown, Row, Table } from 'antd'
import React from 'react'
import PrimaryButton from '../PrimaryButton'
import styles from '@/styles/components/Table.module.scss'
import TableActionsDropdown from '../dashboard/TableActionsDropdown'
import { BsThreeDots } from 'react-icons/bs'
import { PlusOutlined } from '@ant-design/icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const RoleTable = ({ roleTableDropdownItems, setAttachResourceModal, roles, totalRoles, first, last }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const router = useRouter();
    const q = searchParams.get("q");




    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: 'Role Key',
            dataIndex: 'roleKey',
            key: 'roleKey',
        },
        {
            title: 'Role Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Tenant',
            dataIndex: 'tenantName',
            key: 'tenantName',
        },
        {
            title: '',
            dataIndex: 'attachResource',
            key: 'attachResource',
            render: (_, record) => <PrimaryButton onClick={() => setAttachResourceModal({ ...record })} buttonType="text" className={styles.tableInlineButton} icon={<PlusOutlined />}>attach resources</PrimaryButton>
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            width: "4rem",

            render: (_, record) => (<Dropdown trigger={["click"]} dropdownRender={() => <TableActionsDropdown items={roleTableDropdownItems} record={record} />}>
                <div>
                    <Button className={styles.actionsButtonContainer}>
                        <BsThreeDots className={styles.actionsIconButton} />
                    </Button>
                </div>
            </Dropdown>)
        },
    ];

    const handleNextPage = () => {
        if (last) return;
        router.push(`${pathname}?${q ? "q=" + q + "&" : ""}starting_after=${roles[roles.length - 1].roleKey}`)
    }

    const handlePreviousPage = () => {
        if (first) return;
        router.push(`${pathname}?${q ? "q=" + q + "&" : ""}ending_before=${roles[0].roleKey}`)
    }


    return (
        <div className={styles.resourceTableContainer}>
            <Table
                dataSource={roles}
                columns={columns}
                pagination={false}
            />
            <Row align="middle" justify="space-between" className={styles.tableFooter}>
                <div className={styles.itemsCount}><span>{totalRoles ?? 0}</span>Roles</div>
                <div className={styles.paginationButtons}>
                    <PrimaryButton buttonType="pagination" disabled={!!first} onClick={handlePreviousPage}>Previous</PrimaryButton>
                    <PrimaryButton buttonType="pagination" disabled={!!last} onClick={handleNextPage}>Next</PrimaryButton>
                </div>
            </Row>
        </div>
    )
}

export default RoleTable