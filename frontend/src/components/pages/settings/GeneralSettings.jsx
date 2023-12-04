"use client";

import React, { useEffect, useState } from 'react'
import styles from "@/styles/pages/Settings.module.scss"
import { Avatar, Col, Divider, Form, Input, Row, message } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import tableStyles from '@/styles/components/Table.module.scss'
import { useMutation } from 'react-query';
import { updateProjectDetails } from '@/services/project.service';
import { useRouter } from 'next/navigation';
import { roleAndResourceRegex } from '@/services/constants';


const GeneralSettings = ({ projectKey, projects }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter()

    const [currentProject, setCurrentProject] = useState(projects.find(project => project.projectKey === projectKey));
    const [form] = Form.useForm()
    const inputProjectName = Form.useWatch('projectName', form);
    const inputProjectKey = Form.useWatch('newProjectKey', form);

    useEffect(() => {
        setCurrentProject(projects.find(project => project.projectKey === projectKey));
    }, [projects, projectKey]);

    const handleReset = () => {
        form.setFieldsValue({
            newProjectKey: currentProject?.projectKey,
            projectName: currentProject?.projectName,
        })
    }

    const updateProjectDetailsMutation = useMutation(updateProjectDetails, {
        onSuccess: (data) => {
            messageApi.success("Details updated successfully!")
            router.push(`/${data.projectKey}/settings`)
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")

        }
    })

    const handleSaveChanges = async () => {
        await updateProjectDetailsMutation.mutateAsync({
            projectKey: currentProject?.projectKey,
            projectName: inputProjectName,
            newProjectKey: inputProjectKey
        })
    }


    return (
        <>
            {contextHolder}
            <div className={styles.settingsContainer}>
                <div className={styles.settingsSectionContainer}>
                    <Row align="middle" className={styles.settingsSection}>
                        <Col span={10} className={styles.settingsLabelSection}>
                            <div className={styles.settingsLabel}>Your Project Icon</div>
                            <div className={styles.settingsDescription}>This will be make your project easier to identify.</div>
                        </Col>
                        <Col span={14} className={styles.settingsInputSection}>
                            <Row align="middle" className={styles.profileSection}>
                                <Avatar size={64} className={styles.profileImage}>{currentProject?.projectName[0]}</Avatar>
                                {/* <PrimaryButton buttonType="text" className={styles.deleteSection}>Delete</PrimaryButton>
                                <PrimaryButton buttonType="text" className={styles.updateSection}>Update</PrimaryButton> */}
                            </Row>
                        </Col>
                    </Row>
                </div>

                <Divider className={styles.settingsDivider} />

                <Form form={form} initialValues={{ newProjectKey: currentProject?.projectKey, projectName: currentProject?.projectName }} style={{ margin: 0, lineHeight: "auto" }} onFinish={handleSaveChanges}>
                    <div className={styles.settingsSectionContainer}>
                        <Row align="middle" className={styles.settingsSection}>
                            <Col span={10} className={styles.settingsLabelSection}>
                                <div className={styles.settingsLabel}>Project Name</div>
                                <div className={styles.settingsDescription}>Enhance readability with a user-friendly name for your Project.</div>
                            </Col>
                            <Col span={14} className={styles.settingsInputSection}>
                                <Form.Item name="projectName" style={{ margin: 0 }} rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Project Name!',
                                    },
                                ]}>
                                    <Input placeholder="Enter a project name" className={styles.settingsInput} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row align="middle" className={styles.settingsSection}>
                            <Col span={10} className={styles.settingsLabelSection}>
                                <div className={styles.settingsLabel}>Project Key</div>
                                <div className={styles.settingsDescription}>Key is an identifier for API interactions, simplifying SDK integration and usage.</div>
                            </Col>
                            <Col span={14} className={styles.settingsInputSection}>
                                <Form.Item name="newProjectKey" style={{ margin: 0 }} rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Project Key!',
                                    },
                                    {
                                        pattern: roleAndResourceRegex,
                                        message: 'Key must only consist of lowercase letters, numeric digits, hyphens, or underscores.',
                                    }
                                ]}>
                                    <Input placeholder="Enter a project key" className={styles.settingsInput} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    {(inputProjectKey !== currentProject?.projectKey || inputProjectName !== currentProject?.projectName) &&
                        <Row align="middle" justify="space-between" className={tableStyles.changesSaveCard}>
                            <div className={tableStyles.policySaveCardText}>You have unsaved changes</div>
                            <Row align="middle" justify="space-between" className={tableStyles.actionsSection}>
                                <PrimaryButton
                                    size="small"
                                    buttonType="text"
                                    className={tableStyles.cancelButton}
                                    onClick={handleReset}
                                >Discard</PrimaryButton>
                                <PrimaryButton
                                    size="small"
                                    className={tableStyles.saveButton}
                                    htmlType="submit"
                                    loading={updateProjectDetailsMutation.isLoading}
                                >Save changes</PrimaryButton>
                            </Row>
                        </Row>}
                </Form>

                <Divider className={styles.settingsDivider} />

                <div className={styles.settingsSectionContainer}>
                    <Row align="middle" className={styles.settingsSection}>
                        <Col span={10} className={styles.settingsLabelSection}>
                            <div className={styles.settingsLabel}>Danger Zone</div>
                            <div className={styles.settingsDescription}>Deleting your project is irreversible. Once removed, it cannot be retrieved.</div>
                        </Col>
                        <Col span={14} className={styles.settingsInputSection}>
                            <PrimaryButton className={styles.deleteButton}>Delete Project</PrimaryButton>
                        </Col>
                    </Row>
                </div>




            </div>
        </>

    )
}

export default GeneralSettings