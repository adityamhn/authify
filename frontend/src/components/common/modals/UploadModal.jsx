import { Form, Input, Modal, Radio, Row } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import PrimaryButton from '../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import Dragger from 'antd/es/upload/Dragger'

const UploadModal = ({
    visible,
    setVisible,
    type,
    label
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
                    <h1 className={styles.heading}>{`Upload ${label}s`}</h1>
                </div>
                <Form className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical'>
                    <Form.Item
                        name="fileType"
                        label="Select file type"
                        className={formStyles.formItem}
                    >
                        <Radio.Group defaultValue="a" className={formStyles.formRadioGroup}>
                            <Radio.Button value="a" className={formStyles.radioButton}>JSON</Radio.Button>
                            <Radio.Button value="b" className={formStyles.radioButton}>CSV</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="file"
                        className={formStyles.formItem}
                    >
                        <Dragger className={formStyles.formDragger}>
                            <div className={formStyles.draggerContainer}>
                                <div className={formStyles.draggerTitle}>Click to Upload</div>
                                <div className={formStyles.draggerSubtitle}>Ensure you adhere to the documented JSON/CSV format. For more details, refer <a>here.</a></div>
                            </div>
                        </Dragger>

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
                        >Done</PrimaryButton>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default UploadModal