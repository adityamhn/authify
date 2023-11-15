import { Form, Input, Modal, Row, Select, message } from 'antd'
import React, { useEffect } from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import { useMutation, useQuery } from 'react-query'
import { getTenantsList } from '@/services/tenant.service'
import { createNewUser, editUser } from '@/services/userDirectory.service'
import { roleAndResourceRegex } from '@/services/constants'
import { getRolesList } from '@/services/role.service'



const AddUserModal = ({
    visible,
    setVisible,
    projectKey,
    revalidate
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const selectedTenant = Form.useWatch('tenant', form);

    const closeModal = () => {
        setVisible(false)
    }

    const { data: tenantsList, isLoading: fetchingTenantsList } = useQuery(["tenants-list", projectKey], () => getTenantsList(projectKey))

    const { data: availableRolesList, isLoading: fetchingRolesList } = useQuery(["role-list", projectKey, selectedTenant], () => getRolesList({ projectKey, tenantId: selectedTenant }), {
        enabled: !!visible && !!selectedTenant,
    })

    const createUserMutation = useMutation(createNewUser, {
        onSuccess: (data) => {
            messageApi.success('User created successfully')
            form.resetFields()
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const editUserMutation = useMutation(editUser, {
        onSuccess: (data) => {
            messageApi.success('User updated successfully')
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const handleCreateUser = async (values) => {
        if (visible.edit) {
            await editUserMutation.mutateAsync({
                userDirectoryId: visible._id,
                userName: values.userName,
                userKey: values.userKey,
                email: values.email,
                assignRole: values.assignRole,
                projectKey
            })
        } else {
            await createUserMutation.mutateAsync({
                userName: values.userName,
                userKey: values.userKey,
                email: values.email,
                assignRole: values.assignRole,
                tenantId: values.tenant,
                projectKey
            })
        }

    }


    useEffect(() => {
        if (visible.edit) {
            form.setFieldsValue({
                userName: visible.userName,
                userKey: visible.userKey,
                email: visible.email,
                assignRole: visible.assignedRole,
                tenant: tenantsList?.tenants?.find(tenant => tenant.tenantKey === visible.tenantKey)?._id
            })
        } else {
            form.resetFields()
        }
    }, [visible, tenantsList, form])


    const roleOptions = [
        {
            label: "Admin",
            value: "admin"

        },
        {
            label: "User",
            value: "user"

        },
        {
            label: "Viewer",
            value: "viewer"
        }
    ]


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
                        <h1 className={styles.heading}>{visible?.edit ? "Edit" : "Add"} User</h1>
                    </div>
                    <Form
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                        onFinish={handleCreateUser}
                        initialValues={{
                            tenant: tenantsList?.tenants?.find(tenant => tenant.type === "global")?._id
                        }}>
                        <Form.Item
                            name="userName"
                            label="User Name"
                            className={formStyles.formItem}
                            extra="Enhance readability with a user-friendly name for your Project. "
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a User Name',
                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  Aditya Peela' />
                        </Form.Item>
                        <Form.Item
                            name="userKey"
                            label={<Row align="middle" style={{ gap: 8 }}><label>User Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
                            className={formStyles.formItem}
                            extra="Key is an identifier for API interactions, simplifying SDK integration and usage."
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a User Key',
                                },
                                {
                                    pattern: roleAndResourceRegex,
                                    message: 'Key must only consist of lowercase letters, numeric digits, hyphens, or underscores.',

                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='<Unique Id of user>' />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="User Email"
                            className={formStyles.formItem}
                            extra="Email is an identifier for API interactions, simplifying SDK integration and usage"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a User Email',
                                },
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email address'
                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example : aditya@gmail.com' />
                        </Form.Item>
                        <Form.Item
                            name="tenant"
                            label={<Row align="middle" style={{ gap: 8 }}><label>Tenant</label></Row>}
                            className={`${formStyles.formItem} ${styles.modalSeperatorItem}`}
                            extra="Choose the desired Tenant for this user. Selecting the 'global tenant' ensures the user availability across all tenants."
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
                        <Form.Item
                            name="assignRole"
                            label={<Row align="middle" style={{ gap: 8 }}><label>Assign Role</label></Row>}
                            className={`${formStyles.formItem}`}
                            extra="Assign a role for the user in the selected Tenant."
                        >
                            <Select
                                loading={fetchingRolesList}
                                style={{ width: '100%' }}
                                placeholder="Assign Role"
                                className={`${formStyles.formSelect} ${styles.modalInput}`}
                                options={availableRolesList?.roles?.map(role => ({ label: `${role.roleName} ( ${role.roleKey} )`, value: role._id })) ?? []}
                                showSearch
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
                                loading={createUserMutation.isLoading || editUserMutation.isLoading}
                            >{visible.edit ? "Save" : "Create User"}</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default AddUserModal