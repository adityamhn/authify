import React from 'react'
import styles from "@/styles/pages/Onboarding.module.scss"
import formStyles from "@/styles/components/Form.module.scss"

import { Form, Input } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'

const OnboardingStep1 = ({ handleUpdateUserOnboarding, loading }) => {

    const handleOnboardingStep1 = async (values) => {
        await handleUpdateUserOnboarding(0, values)
    }


    return (
        <div className={styles.onboardingStepContainer}>
            <h1 className={styles.title}>Welcome! First things first...</h1>
            <p className={styles.description}>You can always change them later.</p>

            <Form className={`${formStyles.formContainer} ${styles.onboardingForm}`} layout='vertical' onFinish={handleOnboardingStep1}>
                <Form.Item
                    name="name"
                    label="Display Name"
                    className={formStyles.formItem}
                    rules={[{ required: true, message: 'Please input your display name!' }]}
                >
                    <Input className={formStyles.formInput} placeholder='Example : John Doe' />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Set a password"
                    className={formStyles.formItem}
                    rules={
                        [
                            {
                                required: true,
                                message: 'Please input your password!'
                            },
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters long!'
                            }
                        ]}
                >
                    <Input.Password className={formStyles.formInputPassword} placeholder='New Password' />
                </Form.Item>
                <PrimaryButton
                    className={formStyles.formButton}
                    htmlType='submit'
                    loading={loading}
                >Continue</PrimaryButton>
            </Form>

        </div>
    )
}

export default OnboardingStep1