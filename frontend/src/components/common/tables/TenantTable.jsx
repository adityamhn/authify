import { Button, Dropdown, Row, Table } from 'antd'
import React from 'react'
import PrimaryButton from '../PrimaryButton'
import styles from '@/styles/components/Table.module.scss'
import TableActionsDropdown from '../dashboard/TableActionsDropdown'
import { BsThreeDots } from 'react-icons/bs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const TenantTable = ({ tenantTableDropdownItems, tenants, totalTenants, first, last }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const router = useRouter();
    const q = searchParams.get("q");


    const columns = [
        {
            title: 'Tenant Name',
            dataIndex: 'tenantName',
            key: 'tenantName',
        },
        {
            title: 'Tenant Key',
            dataIndex: 'tenantKey',
            key: 'tenantKey',
        },
        {
            title: 'Tenant Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'No. of Users',
            dataIndex: 'totalUsers',
            key: 'totalUsers',
            render: (text) => <span>{text ?? 0}</span>
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            width: "4rem",
            render: (_, record) => (<Dropdown trigger={["click"]} dropdownRender={() => <TableActionsDropdown items={tenantTableDropdownItems} record={record} />}>
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
        router.push(`${pathname}?${q ? "q=" + q + "&" : ""}starting_after=${tenants[tenants.length - 1].tenantKey}`)
    }

    const handlePreviousPage = () => {
        if (first) return;
        router.push(`${pathname}?${q ? "q=" + q + "&" : ""}ending_before=${tenants[0].tenantKey}`)
    }



    return (
        <div className={styles.resourceTableContainer}>
            <Table
                dataSource={tenants}
                columns={columns}
                pagination={false}
            />
            <Row align="middle" justify="space-between" className={styles.tableFooter}>
                <div className={styles.itemsCount}><span>{totalTenants ?? 0}</span>Tenants</div>
                <div className={styles.paginationButtons}>
                    <PrimaryButton buttonType="pagination" disabled={!!first} onClick={handlePreviousPage}>Previous</PrimaryButton>
                    <PrimaryButton buttonType="pagination" disabled={!!last} onClick={handleNextPage}>Next</PrimaryButton>
                </div>
            </Row>
        </div>
    )
}

export default TenantTable