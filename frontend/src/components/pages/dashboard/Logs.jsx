import React from 'react'
import styles from "@/styles/pages/Dashboard.module.scss"

const Logs = () => {
  return (
    <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
            <h1 className={styles.heading}>Activity Logs</h1>
        </div>
    </div>
  )
}

export default Logs