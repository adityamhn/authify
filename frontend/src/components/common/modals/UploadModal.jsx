import { Form, Input, Modal, Radio, Row, message } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import PrimaryButton from '../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import Dragger from 'antd/es/upload/Dragger'
import { useMutation } from 'react-query'
import { uploadResourceList } from '@/services/resource.service'


const uploadApi = {
    resource: uploadResourceList
}

const UploadModal = ({
    visible,
    setVisible,
    type,
    label,
    projectKey
}) => {
    const [form] = Form.useForm()
    const selectedFileType = Form.useWatch('fileType', form);
    const [messageApi, contextHolder] = message.useMessage();


    const closeModal = () => {
        form.resetFields();
        setVisible(false);
    }

    const beforeUpload = (file) => {
        const isProperFormat = selectedFileType === "csv" ? file.type === "text/csv" : file.type === "application/json";
        if (!isProperFormat) {
            message.error("You can only upload JSON/CSV files!");
            return Upload.LIST_IGNORE;
        }
        const isLt25M = file.size / 1024 / 1024 < 25;
        if (!isLt25M) {
            message.error("File must smaller than 25MB!");
            return Upload.LIST_IGNORE;
        }

        return isProperFormat && isLt25M ? true : Upload.LIST_IGNORE;
    };

    const uploadDataMutation = useMutation(uploadApi[type], {
        onSuccess: () => {
            messageApi.open({
                content: "Data uploaded successfully",
                key: "uploadData",
                type: "success"
            })
        },
        onError: (error) => {
            message.open({
                content: error?.response?.data?.message || "Something went wrong",
                key: "uploadData",
                type: "error"
            })
        }
    })

    const handleUpload = async (values) => {
        const formData = new FormData();
        formData.append("upload", values.file.file.originFileObj);
        formData.append("fileType", values.fileType);
        formData.append("projectKey", projectKey);

        messageApi.open({
            content: "Validating data...",
            key: "uploadData",
            type: "loading"
        })

        await uploadDataMutation.mutateAsync(formData)

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
                        <h1 className={styles.heading}>{`Upload ${label}s`}</h1>
                    </div>
                    <Form initialValues={{
                        fileType: "json"
                    }}
                        form={form}
                        className={`${formStyles.formContainer} ${styles.modalForm}`}
                        layout='vertical'
                        onFinish={handleUpload}>
                        <Form.Item
                            name="fileType"
                            label="Select file type"
                            className={formStyles.formItem}
                            rules={[{ required: true, message: 'Please select a file type' }]}
                        >
                            <Radio.Group className={formStyles.formRadioGroup}>
                                <Radio.Button value="json" className={formStyles.radioButton}>JSON</Radio.Button>
                                <Radio.Button value="csv" className={formStyles.radioButton}>CSV</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="file"
                            className={formStyles.formItem}
                            rules={[{ required: true, message: 'Please upload a file' }]}
                        >
                            <Dragger className={formStyles.formDragger}
                                multiple={false}
                                customRequest={({ file, onSuccess }) => {
                                    setTimeout(() => {
                                        onSuccess("ok");
                                    }, 0);
                                }}
                                progress
                                accept={selectedFileType === "csv" ? ".csv" : ".json"}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                            >
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
                                loading={uploadDataMutation.isLoading}
                            >Done</PrimaryButton>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default UploadModal