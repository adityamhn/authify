import { Form, Input, Modal, Row, Select } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"


const EditResourceModal = ({
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
                    <h1 className={styles.heading}>Edit Resource</h1>
                </div>
                <Form className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical'>
                    <Form.Item
                        name="resourceName"
                        label="Resource Name"
                        className={formStyles.formItem}
                        extra="Enhance readability with a user-friendly name for your Project. "
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  Profile' />
                    </Form.Item>
                    <Form.Item
                        name="resourceKey"
                        label={<Row align="middle" style={{ gap: 8 }}><label>Resource Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
                        className={formStyles.formItem}
                        extra="Key is an identifier for API interactions, simplifying SDK integration and usage."
                    >
                        <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example : profile' />
                    </Form.Item>
                    <Form.Item
                        name="resourceDescription"
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
                    >
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Tags Mode"
                            className={`${formStyles.formSelectTags} ${styles.modalInput}`}
                            defaultValue={['read', 'write', 'update', 'delete']}
                            suffixIcon={null}

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
                        >Save Resource</PrimaryButton>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default EditResourceModal