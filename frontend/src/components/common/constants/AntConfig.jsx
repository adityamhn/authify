"use client"

import { ConfigProvider } from 'antd'
import React from 'react'
import styles from "@/styles/components/Common.module.scss"
import Image from 'next/image';
import emptyState from "@/assets/common/emptyState.svg"
import { useParams, usePathname, useSearchParams } from 'next/navigation';

const getEmptyStateText = (pathname, projectKey) => {
    switch (pathname) {
        case `/${projectKey}/users`: {
            return "No users found"
        }
        case `/${projectKey}/resources`: {
            return "No resources found"
        }
        case `/${projectKey}/roles`: {
            return "No roles found"
        }
        case `/${projectKey}/tenants`: {
            return "No tenants found"
        }
        default:
            return "Data Not Found"
    }
}

const getEmptyStateSubText = (q) => {
    if (q) {
        return "Try changing the filters or search term"
    }
}


const AntConfig = ({ children }) => {
    const pathname = usePathname();
    const { projectKey } = useParams();
    const searchParams = useSearchParams();
    const q = searchParams.get("q");


    const renderEmpty = () => (
        <div className={styles.emptyStateContainer}>
            <Image src={emptyState} width={90} height={90} className={styles.emptyStateImage} alt="Empty State" />
            <div className={styles.emptyStateImageText}>{getEmptyStateText(pathname, projectKey)}</div>
            {getEmptyStateSubText(q) && (
                <div className={styles.emptyStateImageSubText}>{getEmptyStateSubText(q)}</div>
            )}

        </div>
    );

    return (
        <ConfigProvider renderEmpty={renderEmpty}>
            {children}
        </ConfigProvider>
    )
}

export default AntConfig