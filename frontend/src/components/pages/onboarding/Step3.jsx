
import React, { useState } from 'react'
import styles from "@/styles/pages/Onboarding.module.scss"
import formStyles from "@/styles/components/Form.module.scss"

import { Form, Row } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import { BiSolidUser } from "react-icons/bi"
import { RiBuildingLine } from "react-icons/ri"

const OnboardingStep3 = ({ handleUpdateUserOnboarding, loading }) => {
    const [activeUse, setActiveUse] = useState(0);


    const handleOnboardingStep3 = async () => {
        await handleUpdateUserOnboarding(2, {
            useType: activeUse === 0 ? "personal" : "professional"
        })
    }

    return (
        <div className={styles.onboardingStepContainer}>
            <h1 className={styles.title}>How are planning to use RBAC?</h1>
            <p className={styles.description}>This will help us give you a better overall experience</p>

            <Form className={`${formStyles.formContainer} ${styles.onboardingForm}`} layout='vertical'>
                <Form.Item
                    className={formStyles.formItem}
                >
                    <Row className={styles.useGroup}>
                        <div onClick={() => {
                            setActiveUse(0)
                        }} className={`${styles.useButton} ${activeUse === 0 && styles.activeUseButton}`}>
                            <BiSolidUser className={styles.useIcon} />
                            <div className={styles.useTitle}>Personal Project</div>
                            <div className={styles.useSubTitle}>
                                I’m using RBAC to implement in my personal projects.</div>
                        </div>
                        <div onClick={() => {
                            setActiveUse(1)
                        }} className={`${styles.useButton} ${activeUse === 1 && styles.activeUseButton}`}>
                            <RiBuildingLine className={styles.useIcon} />
                            <div className={styles.useTitle}>Professional Work</div>
                            <div className={styles.useSubTitle}>
                                Implement strict authorisation policies at your organisation.</div>
                        </div>

                    </Row>
                </Form.Item>
                <PrimaryButton
                loading={loading}
                    className={formStyles.formButton}
                    onClick={handleOnboardingStep3}
                >Continue</PrimaryButton>
            </Form>

        </div>
    )
}

export default OnboardingStep3