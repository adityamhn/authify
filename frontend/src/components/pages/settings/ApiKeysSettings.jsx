"use client";

import React, { useState } from 'react'
import styles from "@/styles/pages/Settings.module.scss"
import { Col, Row } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton';
import { PlusOutlined } from '@ant-design/icons';
import APIKeysTable from '@/components/common/settings/APIKeysTable';
import CreateApiKeyModal from '@/components/common/modals/settings/CreateApiKeyModal';




const ApiKeysSettings = ({ apiKeys, revalidate, projectKey }) => {
    // Modals
    const [createKeyModal, setCreateKeyModal] = useState(false);


    return (
        <div className={styles.settingsContainer}>

            <div className={styles.settingsSectionContainer}>
                <Row className={styles.settingsSection}>
                    <Col span={8} className={styles.settingsLabelSection}>
                        <div className={styles.settingsLabel}>API Keys</div>
                        <div className={styles.settingsDescription}>
                            Create API keys to use with Authify{"'"}s API.
                        </div>
                        <PrimaryButton size="small" icon={<PlusOutlined />} className={styles.settingsSectionButton} onClick={() => setCreateKeyModal(true)}>New API key</PrimaryButton>
                    </Col>
                    <Col span={16} className={styles.settingsInputSection}>
                        <APIKeysTable apiKeys={apiKeys} projectKey={projectKey} />
                    </Col>
                </Row>

            </div>

            {/* Modals */}
            <CreateApiKeyModal visible={createKeyModal} setVisible={setCreateKeyModal} revalidate={revalidate} projectKey={projectKey} />
        </div>
    )
}

export default ApiKeysSettings