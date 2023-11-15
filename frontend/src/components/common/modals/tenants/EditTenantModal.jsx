import { Form, Input, Modal, Row, Select } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"



const EditTenantModal = ({
    visible,
    setVisible,
}) => {


    const closeModal = () => {
        setVisible(false)
    }


    return (
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
                    <h1 className={styles.heading}>Edit Tenant</h1>
                </div>
                <Form className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical'>
                    <Form.Item
                        name="tenantName"
                        label="Tenant Name"
                        className={formStyles.formItem}
                        extra="Enhance readability with a user-friendly name for your Project. "
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  ACME Corp' />
                    </Form.Item>
                    <Form.Item
                        name="tenantKey"
                        label={<Row align="middle" style={{ gap: 8 }}><label>Tenant Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
                        className={formStyles.formItem}
                        extra="Key is an identifier for API interactions, simplifying SDK integration and usage."
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='<Unique Id of tenant>' />
                    </Form.Item>
                    <Form.Item
                        name="tenantDescription"
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
                        >Save Tenant</PrimaryButton>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default EditTenantModal