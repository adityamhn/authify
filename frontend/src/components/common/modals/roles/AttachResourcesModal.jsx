import { Col, Form, Input, List, Modal, Row, TreeSelect, message } from 'antd'
import React, { useEffect } from 'react'
import styles from "@/styles/components/Modal.module.scss"
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import { CloseOutlined } from '@ant-design/icons'
import { getResourceList } from '@/services/resource.service'
import { useMutation, useQuery } from 'react-query'
import { attachResources, getResourcesAttached } from '@/services/role.service'


const AttachResourcesModal = ({
    visible,
    setVisible,
    projectKey,
    revalidate
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const attachedResources = Form.useWatch('attachedResources', form);

    const { data: availableResourceList, isLoading: fetchingResourceList } = useQuery(["resource-list", projectKey], () => getResourceList({ projectKey, tenantKey: visible.tenantKey }), {
        enabled: !!visible,
    })

    const { isLoading: fetchingAttachedResources } = useQuery(["attached-resources", projectKey], () => getResourcesAttached({ projectKey, roleId: visible._id }), {
        enabled: !!visible && !!availableResourceList,
        onSuccess: (data) => {
            const attachedResources = [];

            data?.resourcesAttached?.forEach(resource => {
                const actions = resource.actions.map(action => `${resource.resourceKey}:${action}`)
                attachedResources.push(...actions)
            })

            form.setFieldsValue({
                attachedResources
            })
        }
    })

    const attachResourcesMutation = useMutation(attachResources, {
        onSuccess: () => {
            messageApi.open({
                content: "Resources attached successfully",
                key: "attachResources",
                type: "success"
            })
            revalidate()
        },
        onError: (error) => {
            messageApi.open({
                content: error?.response?.data?.message || "Something went wrong",
                key: "attachResources",
                type: "error"
            })
        }
    })

    const handleAttachResources = async (values) => {
        messageApi.open({
            content: "Adding Resources...",
            key: "attachResources",
            type: "loading"
        })
        await attachResourcesMutation.mutateAsync({
            projectKey,
            roleId: visible._id,
            actions: values.attachedResources
        })
    }




    const closeModal = () => {
        setVisible(false)
    }

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                role: `${visible.roleName} (${visible.roleKey})`,
            })
        } else {
            form.resetFields()
        }
    }, [visible, availableResourceList, form])


    const formatTreeData = (resources) => {
        return resources.map(resource => {
            return {
                title: resource.resourceName,
                value: resource.resourceKey,
                children: resource.actions?.map(action => {
                    return {
                        title: `${resource.resourceKey}:${action}`,
                        value: `${resource.resourceKey}:${action}`,
                    }
                })
            }
        })
    }

    const handleClearAll = () => {
        form.setFieldsValue({
            attachedResources: []
        })
    }

    const handleClearSingleAction = (actionKey) => {
        const attachedResources = form.getFieldValue('attachedResources')
        const newAttachedResources = attachedResources.filter(resource => resource !== actionKey)
        form.setFieldsValue({
            attachedResources: newAttachedResources
        })
    }




    return (
        <>{contextHolder}
            <Modal
                open={visible}
                onCancel={closeModal}
                centered
                closeIcon={null}
                footer={null}
                className={styles.appModalContainer}
                width={600}
            >
                <div className={styles.appModalWrapper}>
                    <div className={styles.modalHeader}>
                        <h1 className={styles.heading}>Attach Resources to Role</h1>
                    </div>
                    <Form form={form} className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical' onFinish={handleAttachResources}>
                        <Form.Item
                            name="role"
                            label="Role"
                            className={formStyles.formItem}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Admin (admin)' disabled />
                        </Form.Item>
                        <Row align="middle" className={formStyles.formRow}>
                            <Col span={21}>
                                <Form.Item
                                    name="attachedResources"
                                    label={<Row align="middle" style={{ gap: 8 }}><label>Attach Resources to this role</label></Row>}
                                    className={`${formStyles.formItem} `}
                                >
                                    <TreeSelect
                                        treeCheckable
                                        treeData={formatTreeData(availableResourceList?.resources ?? [])}
                                        maxTagCount={3}
                                        style={{ width: '100%', overflow: 'auto'}}
                                        showSearch
                                        treeDefaultExpandAll
                                        className={`${formStyles.formTreeSelect} ${styles.modalInput}`}
                                        placeholder="Select Resources"
                                        loading={fetchingResourceList || fetchingAttachedResources}

                                    />
                                </Form.Item>
                            </Col>
                            <Col span={3} className={formStyles.formRowButtonContainer}>
                                <PrimaryButton buttonType="text" size="small" color="primary" onClick={handleClearAll}>Clear</PrimaryButton>
                            </Col>
                        </Row>
                        <div className={styles.attachedResourcesListContainer}>
                            <List
                                className={styles.attachedResourcesList}
                                size="small"
                                bordered
                                loading={fetchingResourceList || fetchingAttachedResources}
                                dataSource={attachedResources}
                                renderItem={(item) => <List.Item className={styles.attachedResourcesListItem}>
                                    {item}
                                    <PrimaryButton className={styles.deleteButton} buttonType="text" size="small" color="primary" icon={<CloseOutlined />} onClick={() => handleClearSingleAction(item)} />
                                </List.Item>}
                            />
                            <div className={styles.totalAttachedResourcesList}>
                                {attachedResources?.length ?? 0} Actions Selected
                            </div>
                        </div>
                        <Row justify="end" className={styles.modalButtonsContainer}>
                            <PrimaryButton
                                size="small"
                                buttonType="text"
                                className={`${styles.formButton} ${styles.modalCancelButton}`}
                                onClick={closeModal}
                            >Cancel</PrimaryButton>
                            <PrimaryButton
                                size="small"
                                className={`${styles.formButton} ${styles.modalButton}`}
                                htmlType='submit'
                                loading={attachResourcesMutation.isLoading}
                            >Done</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default AttachResourcesModal