import { Form, Input, Modal, Row, Select } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"



const DuplicateUserModal = ({
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
                    <h1 className={styles.heading}>Duplicate User</h1>
                    <p className={styles.description}>Choose the tenants where you{"'"}d like to replicate this user. Doing so will make it accessible for those tenants to use.</p>
                </div>
                <Form className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical'>
                    <Form.Item
                        name="user"
                        label="User"
                        className={formStyles.formItem}
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} defaultValue='Aditya Peela (aditya@bugbase.in)' disabled />
                    </Form.Item>
                    <Form.Item
                        name="userKey"
                        label="User Key"
                        className={formStyles.formItem}
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} defaultValue='aditya@bugbase.in' disabled />
                    </Form.Item>
                    <Form.Item
                        name="tenant"
                        label={<Row align="middle" style={{ gap: 8 }}><label>Tenant</label></Row>}
                        className={`${formStyles.formItem} ${styles.modalSeperatorItem}`}
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
                    <Form.Item
                        name="role"
                        label={<Row align="middle" style={{ gap: 8 }}><label>Assign Role</label></Row>}
                        className={`${formStyles.formItem}`}
                    >
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Assign Role"
                            className={`${formStyles.formSelect} ${styles.modalInput}`}
                            options={roleOptions}
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
                        >Duplicate User</PrimaryButton>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default DuplicateUserModal