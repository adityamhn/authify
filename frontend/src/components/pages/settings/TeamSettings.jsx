"use client";

import React from 'react'
import styles from "@/styles/pages/Settings.module.scss"
import { Col, Divider, Input, Row, Select } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton';
import TeamMembersTable from '@/components/common/settings/TeamMembersTable';


const { Option } = Select;


const TeamSettings = () => {


    const selectAfter = (
        <Select defaultValue="viewer" className={styles.inviteRoleSelect}>
            <Option value="admin">Invite as admin</Option>
            <Option value="editor">Invite as editor</Option>
            <Option value="viewer">Invite as viewer</Option>
        </Select>
    )

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsSectionContainer}>
                <Row align="middle" className={styles.settingsSection}>
                    <Col span={10} className={styles.settingsLabelSection}>
                        <div className={styles.settingsLabel}>Invite your team</div>
                        <div className={styles.settingsDescription}>Invite your team on Authify to work faster and collaborate easily together.</div>
                    </Col>
                    <Col span={14} className={styles.settingsInputSection}>
                        <Row align="middle" className={styles.inviteEmailSection}>
                            <Input placeholder="Enter email" className={`${styles.settingsInput} ${styles.inviteInput}`} addonAfter={selectAfter} />
                            <PrimaryButton className={styles.sendInviteButton}>Send Invite</PrimaryButton>
                        </Row>
                    </Col>
                </Row>
            </div>

            <Divider className={styles.settingsDivider} />

            <div className={styles.settingsSectionContainer}>
                <Row align="middle" className={styles.settingsSection}>
                    <Col span={10} className={styles.settingsLabelSection}>
                        <div className={styles.settingsLabel}>Team Members</div>
                        <div className={styles.settingsDescription}>Invite your team on Authify to work faster and collaborate easily together.</div>
                    </Col>
                    <Col span={14} className={styles.settingsInputSection}>
                        <TeamMembersTable />
                    </Col>
                </Row>

            </div>

            <Divider className={styles.settingsDivider} />

            <div className={styles.settingsSectionContainer}>
                <Row align="middle" className={styles.settingsSection}>
                    <Col span={10} className={styles.settingsLabelSection}>
                        <div className={styles.settingsLabel}>Pending Invites</div>
                        <div className={styles.settingsDescription}>Invite your team on Authify to work faster and collaborate easily together.</div>
                    </Col>
                    <Col span={14} className={styles.settingsInputSection}>
                    </Col>
                </Row>
            </div>


        </div>
    )
}

export default TeamSettings