"use client";

import { Steps } from 'antd';
import React from 'react'
import OnboardingStep1 from './Step1';
import OnboardingStep2 from './Step2';
import OnboardingStep3 from './Step3';
import OnboardingStep4 from './Step4';
import styles from "@/styles/pages/Onboarding.module.scss";
import { updateUserOnboarding } from '@/services/onboarding.service';
import LoaderPage from '@/components/common/Loader/LoaderPage';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { updateDefaultProject } from '@/store/user.slice';
import { useRouter } from 'next/navigation';

const steps = [{}, {}, {}, {}];

const OnboardingPage = ({ step }) => {
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const router = useRouter()
    const [currentStep, setCurrentStep] = React.useState(step || 0)

    const updateUserOnboardingMutation = useMutation(updateUserOnboarding, {
        onSuccess: (data) => {
            setCurrentStep(data.step)

            if (data.step === 2 && data.projectKey) {
                dispatch(updateDefaultProject(data.projectKey))
            }

            if (data.completed && data.projectKey) {
                dispatch(updateDefaultProject(data.projectKey))
                router.push(`/${data.projectKey}`)
            }
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const handleUpdateUserOnboarding = async (step, data) => {
        await updateUserOnboardingMutation.mutateAsync({
            step,
            data
        })

        await queryClient.invalidateQueries('get-user-onboarding')
    }

    if (updateUserOnboardingMutation.isLoading) {
        return <LoaderPage />
    }

    return (
        <div className={styles.onboardingContainer}>
            <div className={styles.onboardingFormContainer}>
                <Steps
                    current={currentStep}
                    items={steps}
                    className={styles.onboardingSteps}
                />
                {currentStep === 0 ? (
                    <OnboardingStep1 currentStep={currentStep} handleUpdateUserOnboarding={handleUpdateUserOnboarding} loading={updateUserOnboardingMutation.isLoading} />
                ) : currentStep === 1 ? (
                    <OnboardingStep2 currentStep={currentStep} handleUpdateUserOnboarding={handleUpdateUserOnboarding} loading={updateUserOnboardingMutation.isLoading} />
                ) : currentStep === 2 ? (
                    <OnboardingStep3 currentStep={currentStep} handleUpdateUserOnboarding={handleUpdateUserOnboarding} loading={updateUserOnboardingMutation.isLoading} />
                ) : currentStep === 3 ? (
                    <OnboardingStep4 currentStep={currentStep} handleUpdateUserOnboarding={handleUpdateUserOnboarding} loading={updateUserOnboardingMutation.isLoading} />
                ) : null}
            </div>
        </div>
    )
}

export default OnboardingPage