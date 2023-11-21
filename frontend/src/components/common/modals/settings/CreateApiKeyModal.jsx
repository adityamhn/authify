import { Form, Input, Modal, Row, message } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import { createNewApiKey } from '@/services/project.service'
import { useMutation } from 'react-query'



const CreateApiKeyModal = ({
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

    const createNewApiKeytMutation = useMutation(createNewApiKey, {
        onSuccess: (data) => {
            messageApi.success('Api Key created successfully')
            closeModal()
            revalidate()
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const handleCreateApiKey = async (values) => {
        await createNewApiKeytMutation.mutateAsync({ ...values, projectKey })
    }



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
                        <h1 className={styles.heading}>Create New API Key</h1>
                    </div>
                    <Form form={form} className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical' onFinish={handleCreateApiKey}>
                        <Form.Item
                            name="identifier"
                            label="API Key Identifier"
                            className={formStyles.formItem}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input a Identifier',
                                }
                            ]}
                        >
                            <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Enter a name for your API key' />
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
                                loading={createNewApiKeytMutation.isLoading}
                            >Create</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default CreateApiKeyModal