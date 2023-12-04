"use client";

import { Form, Input, message } from 'antd'
import React from 'react'
import styles from "@/styles/pages/Auth.module.scss"
import formStyles from "@/styles/components/Form.module.scss"
import PrimaryButton from '@/components/common/PrimaryButton'
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { userLogin } from '@/services/auth.service';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, updateDefaultProject } from '@/store/user.slice';
import { emailRegex } from '@/services/constants';

const LoginPage = ({ email }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const dispatch = useDispatch();

    const { projectKey } = useSelector(state => state.user)

    const handleEditEmail = () => {
        router.push('/auth')
    }

    const userLoginMutation = useMutation(userLogin, {
        onSuccess: (data) => {
            messageApi.success("Login successful!");
            dispatch(loginUser(data.user))

            if (!projectKey) {
                dispatch(updateDefaultProject(data.projectKey))
                router.push(`/${data.projectKey}`)
            } else {
                router.push(`/${projectKey}`)
            }
        },
        onError: (error) => {
            messageApi.error(error?.response?.data?.message || "Something went wrong")
        }
    })

    const handleLogin = async (values) => {
        await userLoginMutation.mutateAsync({
            email,
            password: values.password
        })
    }

    return (
        <>
            {contextHolder}
            <div className={styles.authFormContainer}>
                <h1 className={styles.title}>Enter Your Password</h1>
                <p className={styles.description}>Enter your password to continue to Authify</p>
                <Form className={`${formStyles.formContainer} ${styles.authForm}`} layout='vertical' onFinish={handleLogin}>
                    <Form.Item
                        label="Email"
                        className={`${formStyles.formItem} ${styles.loginEmailItem}`}
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
                        <Input className={formStyles.formInput} value={email} disabled />
                        <PrimaryButton buttonType="text" className={styles.loginEmailEditBtn} onClick={handleEditEmail}>Edit</PrimaryButton>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        className={`${formStyles.formItem}`}
                        rules={
                            [
                                {
                                    required: true,
                                    message: 'Please input your password!'
                                }
                            ]
                        }
                    >
                        <Input.Password className={formStyles.formInputPassword} placeholder='Enter your email' />
                    </Form.Item>
                    <PrimaryButton
                        className={formStyles.formButton}
                        htmlType='submit'
                        loading={userLoginMutation.isLoading}
                    >Login</PrimaryButton>
                    {/* <PrimaryButton
                        buttonType="text"
                        className={styles.forgotPasswordBtn}
                    >Forgot Password?</PrimaryButton> */}
                </Form>

            </div>
        </>

    )
}

export default LoginPage