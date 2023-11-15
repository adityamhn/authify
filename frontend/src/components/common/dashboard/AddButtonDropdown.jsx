import { Card, Row } from 'antd'
import React from 'react'
import styles from "@/styles/pages/Dashboard.module.scss";


const AddButtonDropdown = ({ items }) => {
    return (
        <Card className={styles.addButtonActionsCard}>
            {items.map((item, index) => (
                <Row align="middle" className={styles.addItem} key={index} onClick={item.onClick}>
                    <div className={styles.addItemName}>{item.label}</div>
                </Row>
            ))}
        </Card>
    )
}

export default AddButtonDropdown