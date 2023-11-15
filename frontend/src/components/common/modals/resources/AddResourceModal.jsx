import { Form, Input, Modal, Row, Select, message } from 'antd'
import React, { useEffect } from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import { useMutation, useQuery } from 'react-query'
import { createNewResource, editResource } from '@/services/resource.service'
import { roleAndResourceRegex } from '@/services/constants'
import { getTenantsList } from '@/services/tenant.service'


const AddResourceModal = ({
    visible,
    setVisible,
    projectKey,
    revalidate
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const closeModal = () => {
        setVisible(false)
    }

    const { data: tenantsList, isLoading: fetchingTenantsList } = useQuery(["tenants-list", projectKey], () => getTenantsList(projectKey))

    const createResourceMutation = useMutation(createNewResource, {
        onSuccess: (data) => {
            messageApi.success('Resource created successfully')
            form.resetFields()
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const editResourceMutation = useMutation(editResource, {
        onSuccess: (data) => {
            messageApi.success('Resource updated successfully')
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const handleCreateResource = async (values) => {
        if (visible.edit) {
            await editResourceMutation.mutateAsync({
                resourceId: visible._id,
                resourceName: values.resourceName,
                resourceKey: values.resourceKey,
                description: values.description,
                actions: values.actions,
                projectKey
            })
        } else {
            await createResourceMutation.mutateAsync({
                resourceName: values.resourceName,
                resourceKey: values.resourceKey,
                description: values.description,
                actions: values.actions,
                tenantId: values.tenant,
                projectKey
            })
        }

    }

    useEffect(() => {
        if (visible.edit) {
            form.setFieldsValue({
                resourceName: visible.resourceName,
                resourceKey: visible.resourceKey,
                description: visible.description,
                actions: visible.actions,
                tenant: tenantsList?.tenants?.find(tenant => tenant.tenantKey === visible.tenantKey)?._id
            })
        } else {
            form.resetFields()
        }
    }, [visible, tenantsList, form])


    return (
        <>
            {contextHolder}
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
                        <h1 className={styles.heading}>{visible?.edit ? "Edit" : "Add"} Resource</h1>
                    </div>
                    <Form
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                        onFinish={handleCreateResource}
                        initialValues={{
                            actions: ['read', 'write', 'update', 'delete'],
                            tenant: tenantsList?.tenants?.find(tenant => tenant.type === "global")?._id
                        }}
                    >
                        <Form.Item
                            name="resourceName"
                            label="Resource Name"
                            className={formStyles.formItem}
                            extra="Enhance readability with a user-friendly name for your Project. "
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Resource Name',
                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  Profile' />
                        </Form.Item>
                        <Form.Item
                            name="resourceKey"
                            label={<Row align="middle" style={{ gap: 8 }}><label>Resource Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
                            className={formStyles.formItem}
                            extra="Key is an identifier for API interactions, simplifying SDK integration and usage."
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Resource Key',
                                },
                                {
                                    pattern: roleAndResourceRegex,
                                    message: 'Key must only consist of lowercase letters, numeric digits, hyphens, or underscores.',

                                }
                            ]}

                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example : profile' />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={<Row align="middle"><label>Resource Description <span className={formStyles.optional}>( optional )</span></label></Row>}
                            className={formStyles.formItem}
                        >
                            <Input.TextArea className={`${formStyles.formTextArea} ${styles.modalInput}`} placeholder='Example : profile' />
                        </Form.Item>
                        <Form.Item
                            name="actions"
                            label={<Row align="middle" style={{ gap: 8 }}><label>Actions</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
                            className={`${formStyles.formItem} ${styles.modalSeperatorItem}`}
                            extra="Actions define how users interact with a resource. For instance, with the 'Profile' resource, actions might include 'edit' and 'update'"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input at least one action',
                                },
                                {
                                    validator: (_, actions) => {
                                        for (const action of actions) {
                                            if (!roleAndResourceRegex.test(action))
                                                return Promise.reject(new Error('Action must only consist of lowercase letters, numeric digits, hyphens, or underscores.'));
                                        }
                                        return Promise.resolve();
                                    }
                                },
                                {
                                    validator: (_, actions) => {
                                        const uniqueActions = [...new Set(actions)]
                                        if (uniqueActions.length !== actions.length)
                                            return Promise.reject(new Error('Actions must be unique'));
                                        return Promise.resolve();
                                    }
                                }
                            ]}

                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Tags Mode"
                                className={`${formStyles.formSelectTags} ${styles.modalInput}`}

                                suffixIcon={null}

                            />
                        </Form.Item>
                        <Form.Item
                            name="tenant"
                            label={<Row align="middle" style={{ gap: 8 }}><label>Tenant</label></Row>}
                            className={`${formStyles.formItem}`}
                            extra="Choose the desired Tenant for this resource. Selecting the 'global tenant' ensures the resource's availability across all tenants."
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a tenant',
                                }
                            ]}
                            
                        >
                            <Select
                                loading={fetchingTenantsList}
                                style={{ width: '100%' }}
                                placeholder="Select Tenant"
                                className={`${formStyles.formSelect} ${styles.modalInput}`}
                                options={tenantsList?.tenants?.map(tenant => ({ label: tenant.tenantName, value: tenant._id }))}
                                showSearch
                                disabled={visible.edit}
                            />
                        </Form.Item>
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
                                loading={createResourceMutation.isLoading || editResourceMutation.isLoading}
                            >{visible.edit ? "Save" : "Create Resource"}</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>

    )
}

export default AddResourceModal