import { Select } from 'antd'
import React from 'react'
import styles from "@/styles/components/Search.module.scss";


const FilterSelect = (props) => {
    return (
        <Select
            {...props}
            options={props.options}
            placeholder={props.placeholder || "Filter"}
            showSearch={props.showSearch}
            className={`${styles.darkBugBaseSelect} ${props.className || ""}`}
            onSelect={props.onSelect}
            defaultValue={props.defaultValue}
            loading={props.loading}
        />
    )
}

export default FilterSelect