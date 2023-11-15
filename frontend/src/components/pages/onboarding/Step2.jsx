
import React from 'react'
import styles from "@/styles/pages/Onboarding.module.scss"
import formStyles from "@/styles/components/Form.module.scss"

import { Form, Input, Row, Tooltip } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import { BiInfoCircle } from 'react-icons/bi'
import { roleAndResourceRegex } from '@/services/constants'

const OnboardingStep2 = ({ handleUpdateUserOnboarding, loading }) => {

    const handleOnboardingStep2 = async (values) => {
        await handleUpdateUserOnboarding(1, values)
    }



    return (
        <div className={styles.onboardingStepContainer}>
            <h1 className={styles.title}>Let’s set up your first Authify project</h1>
            <p className={styles.description}>You can always create more projects later</p>

            <Form className={`${formStyles.formContainer} ${styles.onboardingForm}`} layout='vertical' onFinish={handleOnboardingStep2}>
                <Form.Item
                    name="projectName"
                    label="Project Name"
                    className={formStyles.formItem}
                    extra="Enhance readability with a user-friendly name for your Project."
                    rules={[{ required: true, message: 'Please input your project name!' }]}
                >
                    <Input className={formStyles.formInput} placeholder='Example :  My First Project' />
                </Form.Item>

                <Form.Item
                    name="projectKey"
                    label={<Row align="middle" style={{ gap: 8 }}><label>Project Key</label><Tooltip title="A key must only consist of lowercase letters, numeric digits, hyphens, or underscores."><BiInfoCircle className={formStyles.infoIcon} /></Tooltip></Row>}
                    className={formStyles.formItem}
                    extra="Key is an identifier for API interactions, simplifying SDK integration and usage."
                    rules={[{
                        required: true,
                        message: 'Please input your project key!',

                    }, {
                        pattern: roleAndResourceRegex,
                        message: 'Key must only consist of lowercase letters, numeric digits, hyphens, or underscores.'
                    }]}
                >
                    <Input className={formStyles.formInput} placeholder='Example : my-first-project' />
                </Form.Item>
                <PrimaryButton
                    className={formStyles.formButton}
                    htmlType='submit'
                    loading={loading}
                >Create my first project</PrimaryButton>
            </Form>

        </div>
    )
}

export default OnboardingStep2