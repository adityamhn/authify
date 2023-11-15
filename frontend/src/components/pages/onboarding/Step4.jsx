
import React from 'react'
import styles from "@/styles/pages/Onboarding.module.scss"
import formStyles from "@/styles/components/Form.module.scss"

import { Form, Input, Row } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import checkMark from "@/assets/onboarding/check.svg"
import Image from 'next/image'

const OnboardingStep4 = ({handleUpdateUserOnboarding, loading}) => {

    const handleOnboardingStep4 = async () => {
        await handleUpdateUserOnboarding(4, {})
    }

    return (
        <div className={styles.onboardingStepContainer}>
            <h1 className={styles.title}>You are all set!</h1>
            <p className={styles.description}>Let only the authorized users get inside your API.</p>

            <Form className={`${formStyles.formContainer} ${styles.onboardingForm}`} layout='vertical'>
                <Form.Item
                className={formStyles.formItem}>
                <Image src={checkMark} width={150} height={150} className={styles.checkMark}  />

                </Form.Item>
                <PrimaryButton
                    className={formStyles.formButton}
                    htmlType='submit'
                    onClick={handleOnboardingStep4}
                    loading={loading}
                >Start securing APIs</PrimaryButton>
            </Form>

        </div>
    )
}

export default OnboardingStep4