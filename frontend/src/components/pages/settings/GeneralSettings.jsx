"use client";

import React, { useEffect, useState } from 'react'
import styles from "@/styles/pages/Settings.module.scss"
import { Avatar, Col, Divider, Input, Row } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'

const GeneralSettings = ({projectKey, projects}) => {
  const [currentProject, setCurrentProject] = useState(projects.find(project => project.projectKey === projectKey));


  useEffect(() => {
    setCurrentProject(projects.find(project => project.projectKey === projectKey));
  }, [projects, projectKey]);


    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsSectionContainer}>
                <Row align="middle" className={styles.settingsSection}>
                    <Col span={10} className={styles.settingsLabelSection}>
                        <div className={styles.settingsLabel}>Your Project Icon</div>
                        <div className={styles.settingsDescription}>This will be make your project easier to identify.</div>
                    </Col>
                    <Col span={14} className={styles.settingsInputSection}>
                        <Row align="middle" className={styles.profileSection}>
                            <Avatar size={64} className={styles.profileImage}>B</Avatar>
                            <PrimaryButton buttonType="text" className={styles.deleteSection}>Delete</PrimaryButton>
                            <PrimaryButton buttonType="text" className={styles.updateSection}>Update</PrimaryButton>
                        </Row>
                    </Col>
                </Row>
            </div>

            <Divider className={styles.settingsDivider} />

            <div className={styles.settingsSectionContainer}>
                <Row align="middle" className={styles.settingsSection}>
                    <Col span={10} className={styles.settingsLabelSection}>
                        <div className={styles.settingsLabel}>Project Name</div>
                        <div className={styles.settingsDescription}>Enhance readability with a user-friendly name for your Project.</div>
                    </Col>
                    <Col span={14} className={styles.settingsInputSection}>
                        <Input placeholder="Enter a project name" className={styles.settingsInput} defaultValue={currentProject.projectName} />
                    </Col>
                </Row>
                <Row align="middle" className={styles.settingsSection}>
                    <Col span={10} className={styles.settingsLabelSection}>
                        <div className={styles.settingsLabel}>Project Key</div>
                        <div className={styles.settingsDescription}>Key is an identifier for API interactions, simplifying SDK integration and usage.</div>
                    </Col>
                    <Col span={14} className={styles.settingsInputSection}>
                    <Input placeholder="Enter a project key" className={styles.settingsInput} defaultValue={currentProject.projectKey} />
                    </Col>
                </Row>
            </div>

            <Divider className={styles.settingsDivider} />

            <div className={styles.settingsSectionContainer}>
                <Row align="middle" className={styles.settingsSection}>
                    <Col span={10} className={styles.settingsLabelSection}>
                        <div className={styles.settingsLabel}>Danger Zone</div>
                        <div className={styles.settingsDescription}>Deleting your project is irreversible. Once removed, it cannot be retrieved.</div>
                    </Col>
                    <Col span={14} className={styles.settingsInputSection}>
                        <PrimaryButton  className={styles.deleteButton}>Delete Project</PrimaryButton>
                    </Col>
                </Row>
            </div>


        </div>
    )
}

export default GeneralSettings