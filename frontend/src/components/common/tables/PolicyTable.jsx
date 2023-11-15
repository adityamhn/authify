import React, { useEffect } from 'react'
import styles from '@/styles/components/Table.module.scss'
import { Checkbox, Row, Table, message } from 'antd'
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io'
import PrimaryButton from '../PrimaryButton'
import { PlusOutlined } from '@ant-design/icons'
import { showConfirm } from '../modals/ConfirmModal'
import { useMutation } from 'react-query'
import { updatePolicy } from '@/services/user.service'






const PolicyTable = ({ projectKey, setAddResourceModal, setAddRoleModal, policy, revalidate }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const columns = [
        {
            title: "",
            key: "expandable",
            width: "3rem",
            fixed: 'left',
            render: (_, record) => <>{record.type === "resource" ? <div className={styles.expandRowIcon} onClick={() => handleExpand(record.resourceKey)}>{record.expanded ? <IoMdArrowDropdown /> : <IoMdArrowDropright />} </div> : <div className={!record.isLastAction && "isPolicyTableActionRow"} />}</>
        },
        {
            title: "",
            dataIndex: "resourceKey",
            key: "resourceKey",
            width: "7rem",
            fixed: 'left',
        },
        ...policy.columns?.map((column) => ({
            title: column.roleName,
            dataIndex: column.roleKey,
            key: column.roleKey,
            width: "6rem",
            render: (item, record) => <>{item === "intermediate" ? <Checkbox indeterminate={item} onChange={(e) => handleCheckChange(item, record, column)} /> : <Checkbox checked={item} onChange={(e) => handleCheckChange(item, record, column)} />}</>
        })),
        {
            title: <PrimaryButton buttonType="text" className={styles.addRoleColumnButton} icon={<PlusOutlined />} onClick={() => setAddRoleModal(true)}>Add Role</PrimaryButton>,
            dataIndex: "addRole",
            key: "addRole",
            width: "100%",
            fixed: 'right',
        },
    ]

    const [tableData, setTableData] = React.useState([]);
    const [originalFullData, setOriginalFullData] = React.useState(JSON.parse(JSON.stringify(policy.rows)))
    const [modifiedFullData, setModifiedFullData] = React.useState(JSON.parse(JSON.stringify(policy.rows)));
    const [noOfEdits, setNoOfEdits] = React.useState(0);


    const updatePolicyMutation = useMutation(updatePolicy, {
        onSuccess: () => {
            messageApi.success("Policy updated successfully")
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })


    useEffect(() => {
        setOriginalFullData(JSON.parse(JSON.stringify(policy.rows)))
        setModifiedFullData(JSON.parse(JSON.stringify(policy.rows)))
        setNoOfEdits(0)
    }, [policy])

    useEffect(() => {
        const dataSource = originalFullData?.map((row) => ({
            key: row.key,
            resourceKey: row.resourceKey,
            type: row.type,
            ...row
        }))
        setTableData(dataSource)
    }, [originalFullData])


    useEffect(() => {
        calculateChanges()
    }, [modifiedFullData])

    const handleUpdatePolicy = async () => {
        await updatePolicyMutation.mutateAsync({
            projectKey,
            policy: modifiedFullData,
            tenantKey: policy.tenantKey
        })
    }

    const resetChanges = () => {
        const finalTableData = originalFullData.filter((row) => {
            const found = tableData.find((r) => r.key === row.key)
            if (found) {
                return true
            }
            return false
        }).map((row) => {
            const found = tableData.find((r) => r.key === row.key)
            return ({
                ...row,
                expanded: found.expanded
            })
        });
        setModifiedFullData(originalFullData)
        setTableData(finalTableData)
        setNoOfEdits(0)
    }

    const handleReset = () => {
        showConfirm({
            title: `You have ${noOfEdits} unsaved changes`,
            content: `Are you sure you want to discard all changes?`,
            onOk: () => resetChanges(),
            okText: "Discard",
        })
    }

    const handleExpand = (resourceKey) => {

        const findResource = tableData.find((r) => r.resourceKey === resourceKey && r.type === "resource")

        if (findResource.expanded) {
            const newTableData = tableData.filter((r) => {
                if (r.type === "action") {
                    const [resource, action] = r.key.split(":")

                    if (resource === resourceKey) {
                        return false
                    }

                }

                return true
            })

            setTableData(newTableData.map((r) => {
                if (r.resourceKey === resourceKey && r.type === "resource") {
                    return {
                        ...r,
                        expanded: false
                    }
                }

                return r
            }))
        } else {

            const newTableData = [...tableData]

            const resourceIndex = newTableData.findIndex((r) => r.resourceKey === resourceKey && r.type === "resource")


            const actions = policy.rows?.filter((row) => {
                if (row.type === "action") {
                    const [resource, action] = row.key.split(":")

                    if (resource === resourceKey) {
                        return true
                    }
                }

                return false
            })

            newTableData.splice(resourceIndex + 1, 0, ...actions)


            setTableData(newTableData.map((r) => {
                if (r.resourceKey === resourceKey && r.type === "resource") {
                    return {
                        ...r,
                        expanded: true
                    }
                }

                return r
            }
            ))
        }
    }

    const handleCheckChange = (currentState, record, role) => {
        const newTableData = [...modifiedFullData];

        if (record.type === "action") {
            const [resourceKey, action] = record.key.split(":")


            const allActions = newTableData?.filter((row) => {
                if (row.type === "action") {
                    const [resource, action] = row.key.split(":")

                    if (resource === resourceKey) {
                        return true
                    }
                }
                return false
            })

            allActions.forEach((action) => {
                if (action.key === record.key) {
                    action[role.roleKey] = !currentState
                }
            })

            const resource = newTableData.find((r) => r.resourceKey === resourceKey && r.type === "resource")

            if (allActions.every((action) => action[role.roleKey] === true)) {
                resource[role.roleKey] = true
            } else if (allActions.every((action) => !action[role.roleKey])) {
                resource[role.roleKey] = false
            } else {
                resource[role.roleKey] = "intermediate"
            }
        } else if (record.type === "resource") {
            const allActions = newTableData?.filter((row) => {
                if (row.type === "action") {
                    const [resource, action] = row.key.split(":")

                    if (resource === record.resourceKey) {
                        return true
                    }
                }
                return false
            })

            allActions.forEach((action) => {
                action[role.roleKey] = currentState === "intermediate" ? true : !currentState
            })

            newTableData.forEach((resource) => {
                if (resource.resourceKey === record.resourceKey && resource.type === "resource") {
                    resource[role.roleKey] = currentState === "intermediate" ? true : !currentState
                }
            })
        }

        setModifiedFullData(newTableData)

        const finalTableData = newTableData.filter((row) => {
            const found = tableData.find((r) => r.key === row.key)
            if (found) {
                return true
            }
            return false
        }).map((row) => {
            const found = tableData.find((r) => r.key === row.key)
            return ({
                ...row,
                expanded: found.expanded
            })
        });

        setTableData(finalTableData)


    }

    const calculateChanges = () => {
        const originalData = [...originalFullData];
        const modifiedData = [...modifiedFullData];

        let changes = 0;

        for (let i = 0; i < modifiedData.length; i++) {
            if (modifiedData[i].type === "action") {
                Object.keys(modifiedData[i]).forEach((key) => {
                    if (key !== "key" && key !== "type" && key !== "resourceKey") {
                        if (originalData[i][key] === undefined && modifiedData[i][key]) {
                            changes++;
                        } else if (originalData[i][key] !== undefined && modifiedData[i][key] !== originalData[i][key]) {
                            changes++;
                        }
                    }
                })
            }
        }


        setNoOfEdits(changes)
    }


    return (
        <>
        {contextHolder}
        <div className={`${styles.resourceTableContainer} ${styles.policyTableContainer}`}>
            <Table
                dataSource={tableData}
                columns={columns}
                pagination={false}
                scroll={{
                    x: "100%",
                    // y: 300,
                }}
                footer={() => (
                    <Row className={`${styles.actionTableFooter} ${styles.addResourceFooter}`} align="middle">
                        <PrimaryButton buttonType="text" className={styles.addActionButton} icon={<PlusOutlined />} onClick={() => setAddResourceModal(true)}>Add Resource</PrimaryButton>
                    </Row>
                )}
            />
            {noOfEdits > 0 &&
                <Row align="middle" justify="space-between" className={styles.policySaveCard}>
                    <div className={styles.policySaveCardText}>You have {noOfEdits} unsaved changes</div>
                    <Row align="middle" justify="space-between" className={styles.actionsSection}>
                        <PrimaryButton
                            size="small"
                            buttonType="text"
                            className={styles.cancelButton}
                            onClick={handleReset}
                        >Discard</PrimaryButton>
                        <PrimaryButton
                            size="small"
                            className={styles.saveButton}
                            onClick={handleUpdatePolicy}
                            loading={updatePolicyMutation.isLoading}
                        >Save changes</PrimaryButton>
                    </Row>
                </Row>}
        </div>
        </>

    )
}

export default PolicyTable