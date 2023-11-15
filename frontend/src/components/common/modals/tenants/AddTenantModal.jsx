import { Form, Input, Modal, Row, message } from 'antd'
import React, { useEffect } from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import { useMutation } from 'react-query'
import { createNewTenant, editTenant } from '@/services/tenant.service'
import { roleAndResourceRegex } from '@/services/constants'



const AddTenantModal = ({
    visible,
    setVisible,
    projectKey,
    revalidate
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    console.log(visible)

    const closeModal = () => {
        setVisible(false)
    }

    const createTenantMutation = useMutation(createNewTenant, {
        onSuccess: (data) => {
            messageApi.success('Tenant created successfully')
            form.resetFields()
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const editTenantMutation = useMutation(editTenant, {
        onSuccess: (data) => {
            messageApi.success('Tenant updated successfully')
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })


    const handleCreateTenant = async (values) => {
        if (visible.edit) {
            await editTenantMutation.mutateAsync({
                tenantId: visible._id,
                tenantName: values.tenantName,
                tenantKey: values.tenantKey,
                description: values.description,
                projectKey
            })
        } else {
            await createTenantMutation.mutateAsync({
                tenantName: values.tenantName,
                tenantKey: values.tenantKey,
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
                tenantName: visible.tenantName,
                tenantKey: visible.tenantKey,
                description: visible.description,
            })
        } else {
            form.resetFields()
        }
    }, [visible, form])


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
                        <h1 className={styles.heading}>{visible?.edit ? "Edit" : "Add"} Tenant</h1>
                    </div>
                    <Form form={form} className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical' onFinish={handleCreateTenant}>
                        <Form.Item
                            name="tenantName"
                            label="Tenant Name"
                            className={formStyles.formItem}
                            extra="Enhance readability with a user-friendly name for your Project. "
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Resource Name',
                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  ACME Corp' />
                        </Form.Item>
                        <Form.Item
                            name="tenantKey"
                            label={<Row align="middle" style={{ gap: 8 }}><label>Tenant Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
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
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='<Unique Id of tenant>' />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={<Row align="middle"><label>Tenant Description <span className={formStyles.optional}>( optional )</span></label></Row>}
                            className={formStyles.formItem}
                        >
                            <Input.TextArea className={`${formStyles.formTextArea} ${styles.modalInput}`} placeholder='Example : ACME Corp is a good company' />
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
                                loading={createTenantMutation.isLoading || editTenantMutation.isLoading}
                            >{visible.edit ? "Save" : "Create Tenant"}</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default AddTenantModal