"use client";

import React, { useRef } from 'react'
import styles from "@/styles/pages/Dashboard.module.scss"
import { Col, Row } from 'antd';
import AdvanceSearchBar from '@/components/common/AdvanceSearchBar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LogsTable from '@/components/common/tables/LogsTable';
import { encodeQuery } from '@/utils/queryParser';


const Logs = ({ projectKey, logs, first, last, }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get("q")
  const searchRef = useRef(null)

  const handleSearch = () => {
    const q = searchRef.current?.input?.value;
    const encodedQ = encodeQuery(q)
    console.log(encodedQ)
    router.push(`${pathname}?q=${encodedQ}`)
  }

  const handleSearchClear = () => {
    router.push(`${pathname}`)
  }

  return (
    <>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Activity Logs</h1>
        </div>
        <Row align="middle" className={styles.actionsContainer}>
          <Col className={styles.filterContainer}>
            <AdvanceSearchBar
              defaultValue={q ?? ""}
              searchRef={searchRef}
              placeholder="Search Logs ( filters : resource, action, user, tenant  )"
              className={`${styles.filterbar} ${styles.filterbarLogs}`}
              onSearch={handleSearch}
              allowClear
              filterType="logs"
              onClear={handleSearchClear}
            />
          </Col>
        </Row>
        <div className={styles.dashboardTableContainer}>
          <LogsTable projectKey={projectKey} logs={logs} first={first} last={last} />
        </div>
      </div>
    </>

  )
}

export default Logs