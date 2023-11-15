import { Button, Dropdown, Row, Table } from 'antd'
import React from 'react'
import PrimaryButton from '../PrimaryButton'
import styles from '@/styles/components/Table.module.scss'
import TableActionsDropdown from '../dashboard/TableActionsDropdown'
import { BsThreeDots } from 'react-icons/bs'
import { PlusOutlined } from '@ant-design/icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const UserTable = ({ userTableDropdownItems, setAssignRoleModal,  users, totalUsers, first, last  }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const router = useRouter();
    const q = searchParams.get("q");




    const columns = [
        {
            title: 'Name',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'User Key',
            dataIndex: 'userKey',
            key: 'userKey',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Tenant',
            dataIndex: 'tenantName',
            key: 'tenantName',
        },
        {
            title: 'Role',
            dataIndex: 'assignedRole',
            key: 'assignedRole',
            render: (role) => <>{role ? role : <PrimaryButton onClick={() => setAssignRoleModal(true)} buttonType="text" className={styles.tableInlineButton} icon={<PlusOutlined />}>assign role</PrimaryButton>}</>
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            width: "4rem",

            render: (_, record) => (<Dropdown trigger={["click"]} dropdownRender={() => <TableActionsDropdown items={userTableDropdownItems}  record={record} />}>
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
                dataSource={users}
                columns={columns}
                pagination={false}
            />
            <Row align="middle" justify="space-between" className={styles.tableFooter}>
                <div className={styles.itemsCount}><span>{totalUsers?? 0}</span>Users</div>
                <div className={styles.paginationButtons}>
                <PrimaryButton buttonType="pagination" disabled={!!first} onClick={handlePreviousPage}>Previous</PrimaryButton>
                    <PrimaryButton buttonType="pagination" disabled={!!last} onClick={handleNextPage}>Next</PrimaryButton>
                </div>
            </Row>
        </div>
    )
}

export default UserTable