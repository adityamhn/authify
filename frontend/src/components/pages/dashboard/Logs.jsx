"use client";

import React, { useRef } from 'react'
import styles from "@/styles/pages/Dashboard.module.scss"
import { Col, DatePicker, Row, message } from 'antd';
import AdvanceSearchBar from '@/components/common/AdvanceSearchBar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LogsTable from '@/components/common/tables/LogsTable';
import { encodeQuery } from '@/utils/queryParser';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Logs = ({ projectKey, logs, revalidate, totalLogs, first, last, startDate, endDate }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get("q")
  const searchRef = useRef(null)
  const [messageApi, contextHolder] = message.useMessage();

  const handleSearch = () => {
    const q = searchRef.current?.input?.value;
    const encodedQ = encodeQuery(q)
    console.log(encodedQ)
    router.push(`${pathname}?q=${encodedQ}${startDate ? "&start_date=" + startDate : ""}${endDate ? "&end_date=" + endDate : ""}`)
  }

  const handleSearchClear = () => {
    router.push(`${pathname}${startDate ? "&start_date=" + startDate : ""}${endDate ? "&end_date=" + endDate : ""}`)
  }

  const handleDateChange = (dates) => {
    if (dates.length === 2) {
      const encodedStart = dayjs(dates[0]).format("DD-MM-YYYY");
      const encodedEnd = dayjs(dates[1]).format("DD-MM-YYYY");
      router.push(`${pathname}?${q ? `q=${q}&` : ""}end_date=${encodedEnd}&start_date=${encodedStart}`)
    }
  }

  return (
    <>
      {contextHolder}
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
            <RangePicker
              format="DD-MM-YYYY"
              defaultValue={[dayjs(startDate), dayjs(endDate)]}
              onChange={(dates) => handleDateChange(dates)}
              className={styles.filterRangePicker} />
          </Col>
        </Row>
        <div className={styles.dashboardTableContainer}>
          <LogsTable projectKey={projectKey} logs={logs} totalLogs={totalLogs} first={first} last={last} />
        </div>
      </div>
    </>

  )
}

export default Logs