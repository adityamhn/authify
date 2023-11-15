import { Button, Dropdown, Form, Input, Row, Table } from 'antd';
import React from 'react'
import styles from '@/styles/components/Table.module.scss'
import { BsThreeDots } from 'react-icons/bs'
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io'
import PrimaryButton from '../PrimaryButton';
import TableActionsDropdown from '../dashboard/TableActionsDropdown';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PlusOutlined } from '@ant-design/icons';
import { roleAndResourceRegex } from '@/services/constants';



const ResourceTable = ({ resourceDropdownItems, actionsDropdownItems, resources, totalResources, first, last, handleAddAction, addActionLoading }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const router = useRouter();
    const [actionForm] = Form.useForm();
    const q = searchParams.get("q");

    const [editableFooter, setEditableFooter] = React.useState(false);


    const columns = [
        {
            title: 'Resource Name',
            dataIndex: 'resourceName',
            key: 'resourceName',
            width: "20rem",
        },
        {
            title: 'Resource Key',
            dataIndex: 'resourceKey',
            key: 'resourceKey',
        },
        {
            title: 'Resource Description',
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
            dataIndex: 'actions',
            key: 'actions',
            width: "4rem",

            render: (_, record) => (<Dropdown trigger={["click"]} dropdownRender={() => <TableActionsDropdown items={resourceDropdownItems} record={record} />}>
                <div>
                    <Button className={styles.actionsButtonContainer}>
                        <BsThreeDots className={styles.actionsIconButton} />
                    </Button>
                </div>
            </Dropdown>)
        },
    ];



    const ActionColumns = [
        {
            title: 'Action Name',
            dataIndex: 'action',
            key: 'action',
            width: "20rem",
        },
        {
            title: 'Action Key',
            dataIndex: 'actionKey',
            key: 'actionKey',
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            width: "4rem",
            render: (_, record) => (<Dropdown trigger={["click"]} dropdownRender={() => <TableActionsDropdown items={actionsDropdownItems} record={record} />} >
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
        router.push(`${pathname}?${q ? "q=" + q + "&" : ""}starting_after=${resources[resources.length - 1].resourceKey}`)
    }

    const handlePreviousPage = () => {
        if (first) return;
        router.push(`${pathname}?${q ? "q=" + q + "&" : ""}ending_before=${resources[0].resourceKey}`)
    }

    return (
        <div className={styles.resourceTableContainer}>
            <Table
                dataSource={resources}
                columns={columns}
                pagination={false}
                expandable={{
                    expandedRowRender: (record) => (
                        <>
                            <Table
                                key={record.resourceKey}
                                showHeader={false}
                                dataSource={record.actions?.map(a => ({
                                    action: a,
                                    actionKey: `${record.resourceKey}:${a}`,
                                    resourceId: record._id
                                }))}
                                columns={ActionColumns}
                                pagination={false}
                                footer={() => (
                                    <Row className={styles.actionTableFooter} align="middle">
                                        {editableFooter === record.resourceKey ?
                                            <Form form={actionForm} className={styles.actionTableFooterForm}
                                                onFinish={async (v) => {
                                                    await handleAddAction({
                                                        resourceId: record._id,
                                                        action: v.action,
                                                    })
                                                    actionForm.resetFields()
                                                }}>
                                                <Form.Item name="action" className={styles.actionTableFooterFormItem} rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input an action name!',
                                                    },
                                                    {
                                                        pattern: roleAndResourceRegex,
                                                        message: 'Action must only consist of lowercase letters, numeric digits, hyphens, or underscores.'
                                                    }
                                                ]}>
                                                    <Input placeholder="Action Name" className={styles.addActionInput} />
                                                </Form.Item>
                                                <PrimaryButton buttonType="text" className={styles.addActionButtonSave} htmlType="submit" loading={addActionLoading}>Save</PrimaryButton>
                                                <PrimaryButton buttonType="text" className={styles.addActionButtonCancel} onClick={() => setEditableFooter(false)}>Cancel</PrimaryButton>
                                            </Form>
                                            : <PrimaryButton buttonType="text" className={styles.addActionButton} icon={<PlusOutlined />} onClick={() => setEditableFooter(record.resourceKey)}>Add Action</PrimaryButton>}
                                    </Row>
                                )}
                            />
                        </>),
                    expandIcon: ({ expanded, onExpand, record }) => {
                        if (expanded) {
                            return <div className={styles.expandButton} onClick={e => onExpand(record, e)}><IoMdArrowDropdown /></div>
                        } else {
                            return <div className={styles.expandButton} onClick={e => onExpand(record, e)}><IoMdArrowDropright /></div>
                        }
                    },
                }} />
            <Row align="middle" justify="space-between" className={styles.tableFooter}>
                <div className={styles.itemsCount}><span>{totalResources ?? 0}</span>Resources</div>
                <div className={styles.paginationButtons}>
                    <PrimaryButton buttonType="pagination" disabled={!!first} onClick={handlePreviousPage}>Previous</PrimaryButton>
                    <PrimaryButton buttonType="pagination" disabled={!!last} onClick={handleNextPage}>Next</PrimaryButton>
                </div>
            </Row>
        </div>
    )

}

export default ResourceTable