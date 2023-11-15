import { Form, Input, Modal, Row, Select } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"



const EditUserModal = ({
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
                    <h1 className={styles.heading}>Edit User</h1>
                </div>
                <Form className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical'>
                    <Form.Item
                        name="name"
                        label="User Name"
                        className={formStyles.formItem}
                        extra="Enhance readability with a user-friendly name for your Project. "
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  Aditya Peela' />
                    </Form.Item>
                    <Form.Item
                        name="userKey"
                        label={<Row align="middle" style={{ gap: 8 }}><label>User Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
                        className={formStyles.formItem}
                        extra="Key is an identifier for API interactions, simplifying SDK integration and usage."
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='<Unique Id of user>' />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="User Email"
                        className={formStyles.formItem}
                        extra="Email is an identifier for API interactions, simplifying SDK integration and usage"
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example : aditya@gmail.com' />
                    </Form.Item>
                    <Form.Item
                        name="tenant"
                        label={<Row align="middle" style={{ gap: 8 }}><label>Tenant</label></Row>}
                        className={`${formStyles.formItem} ${styles.modalSeperatorItem}`}
                        extra="Choose the desired Tenant for this user. Selecting the 'default tenant' ensures the user availability across all tenants."
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
                        extra="Assign a role for the user in the selected Tenant."
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
                        >Save User</PrimaryButton>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default EditUserModal