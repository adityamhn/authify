"use client";

import PrimaryButton from '@/components/common/PrimaryButton'
import { Form, Input, message } from 'antd'
import React from 'react'
import styles from "@/styles/pages/Auth.module.scss"
import formStyles from "@/styles/components/Form.module.scss"
import { useMutation } from 'react-query'
import { sendLoginRequest } from '@/services/auth.service'
import { useRouter } from 'next/navigation'
import { emailRegex } from '@/services/constants';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/store/user.slice';


const AuthPage = () => {
    const router = useRouter()
    const dispatch = useDispatch();


    const sendLoginRequestMutation = useMutation(sendLoginRequest, {
        onSuccess: (data) => {
            if (data.user) {
                dispatch(loginUser(data.user))
            }
            if (data.redirect) {
                router.push(data.redirect)
            }
        },
        onError: (error) => {
            message.error(error?.response?.data?.message || "Something went wrong!")
        }
    })

    const handleLoginRequest = async (values) => {
        const { email } = values
        await sendLoginRequestMutation.mutateAsync(email)
    }


    return (
        <div className={styles.authFormContainer}>
            <h1 className={styles.title}>Get Started with Securing your APIs</h1>
            <Form className={`${formStyles.formContainer} ${styles.authForm}`} layout='vertical' onFinish={handleLoginRequest}>
                <Form.Item
                    name="email"
                    label="Email"
                    className={`${formStyles.formItem} ${styles.authEmailInput}`}
                    rules={
                        [
                            {
                                required: true,
                                message: 'Please input your email!'
                            },
                            {
                                pattern: emailRegex,
                                message: 'Please enter a valid email!'
                            }
                        ]
                    }
                >
                    <Input className={formStyles.formInput} placeholder='Enter your email' />
                </Form.Item>
                    <p className={styles.termsText}>By continuing, you acknowledge that you read, and agree to our <a>Terms of Service</a> and our <a>Privacy Policy</a></p>
                <PrimaryButton
                    className={formStyles.formButton}
                    htmlType='submit'
                    loading={sendLoginRequestMutation.isLoading}
                >Continue</PrimaryButton>
            </Form>

        </div>
    )
}

export default AuthPage