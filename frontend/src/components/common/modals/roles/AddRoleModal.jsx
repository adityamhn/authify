import { Form, Input, Modal, Row, Select, message } from 'antd'
import React, { useEffect } from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import { getTenantsList } from '@/services/tenant.service'
import { useMutation, useQuery } from 'react-query'
import { createNewRole, editRole } from '@/services/role.service'
import { roleAndResourceRegex } from '@/services/constants'



const AddRoleModal = ({
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

    const createRoleMutation = useMutation(createNewRole, {
        onSuccess: (data) => {
            messageApi.success('Role created successfully')
            form.resetFields()
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const editRoleMutation = useMutation(editRole, {
        onSuccess: (data) => {
            messageApi.success('Role updated successfully')
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const handleCreateRole = async (values) => {
        if (visible.edit) {
            await editRoleMutation.mutateAsync({
                roleId: visible._id,
                roleName: values.roleName,
                roleKey: values.roleKey,
                description: values.description,
                projectKey
            })
        } else {
            await createRoleMutation.mutateAsync({
                roleName: values.roleName,
                roleKey: values.roleKey,
                description: values.description,
                tenantId: values.tenant,
                projectKey
            })
        }

    }

    useEffect(() => {
        if (visible.edit) {
            form.setFieldsValue({
                roleName: visible.roleName,
                roleKey: visible.roleKey,
                description: visible.description,
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
                        <h1 className={styles.heading}>{visible?.edit ? "Edit" : "Add"} Role</h1>
                    </div>
                    <Form
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                        onFinish={handleCreateRole}
                        initialValues={{
                            tenant: tenantsList?.tenants?.find(tenant => tenant.type === "global")?._id
                        }}>
                        <Form.Item
                            name="roleName"
                            label="Role Name"
                            className={formStyles.formItem}
                            extra="Enhance readability with a user-friendly name for your Project. "
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Role Name',
                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  Admin' />
                        </Form.Item>
                        <Form.Item
                            name="roleKey"
                            label={<Row align="middle" style={{ gap: 8 }}><label>Role Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
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
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example : admin' />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={<Row align="middle"><label>Role Description <span className={formStyles.optional}>( optional )</span></label></Row>}
                            className={formStyles.formItem}
                        >
                            <Input.TextArea className={`${formStyles.formTextArea} ${styles.modalInput}`} placeholder='Example : Admin user' />
                        </Form.Item>
                        <Form.Item
                            name="tenant"
                            label={<Row align="middle" style={{ gap: 8 }}><label>Tenant</label></Row>}
                            className={`${formStyles.formItem} ${styles.modalSeperatorItem}`}
                            extra="Choose the desired Tenant for this role. Selecting the 'global tenant' ensures the role's availability across all tenants."
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
                                loading={createRoleMutation.isLoading || editRoleMutation.isLoading}
                            >{visible.edit ? "Save" : "Create Role"}</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>

    )
}

export default AddRoleModal