"use client";

import { Row } from 'antd';
import React from 'react'
import styles from "@/styles/pages/Home.module.scss";


const Error404 = () => {
  return (
    <div className={styles.homeContainer}>
      <Row justify="end" className={styles.navbar}>
        <h1>404</h1>
      </Row>
    </div>
  )
}

export default Error404