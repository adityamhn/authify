import { Card, Row } from 'antd'
import React from 'react'
import styles from "@/styles/pages/Dashboard.module.scss";


const SearchDropdownMenu = ({ items, handleFilterChange }) => {
    return (
        <Card className={`${styles.addButtonActionsCard} ${styles.searchFilterDropdown}`}>
            {items.map((item, index) => (
                <Row align="middle" className={styles.filterItem} key={index} onClick={() => handleFilterChange(item.value)}>
                    <div className={styles.filterLabel}>{item.label}</div>
                    <div className={styles.filterHelpText}>{item.helpText}</div>
                </Row>
            ))}
        </Card>
    )
}

export default SearchDropdownMenu;