"use client";

import { updateDefaultProject } from '@/store/user.slice';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Redirect = ({ to, projectKey }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { projectKey: defaultProjectKey } = useSelector(state => state.user)

    React.useEffect(() => {
        if (to === "default") {
            if (defaultProjectKey) {
                router.push(`/${defaultProjectKey}`)
            } else {
                dispatch(updateDefaultProject(projectKey))
                router.push(`/${projectKey}`)
            }
        } else {
            router.replace(to)
        }
    }, [to])

    return <></>;
}

export default Redirect