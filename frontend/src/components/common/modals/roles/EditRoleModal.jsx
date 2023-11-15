import { Form, Input, Modal, Row, Select } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"



const EditRoleModal = ({
    visible,
    setVisible,
}) => {


    const closeModal = () => {
        setVisible(false)
    }

    const tenantOptions = [
        {
            label: "Default Tenant",
            value: "default"

        },
        {
            label: "Tenant 1",
            value: "tenant1"

        },
        {
            label: "Tenant 2",
            value: "tenant2"

        }
    ]


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
                    <h1 className={styles.heading}>Edit Role</h1>
                </div>
                <Form className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical'>
                    <Form.Item
                        name="roleName"
                        label="Role Name"
                        className={formStyles.formItem}
                        extra="Enhance readability with a user-friendly name for your Project. "
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  Admin' />
                    </Form.Item>
                    <Form.Item
                        name="roleKey"
                        label={<Row align="middle" style={{ gap: 8 }}><label>Role Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
                        className={formStyles.formItem}
                        extra="Key is an identifier for API interactions, simplifying SDK integration and usage."
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example : admin' />
                    </Form.Item>
                    <Form.Item
                        name="roleDescription"
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
                    >
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Tenant"
                            className={`${formStyles.formSelect} ${styles.modalInput}`}
                            options={tenantOptions}
                            showSearch
                            defaultValue={"default"}
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
                        >Save Role</PrimaryButton>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default EditRoleModal