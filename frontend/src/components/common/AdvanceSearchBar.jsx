import { Dropdown, Input, Row } from "antd";
import React, { useState } from "react";
import { CloseCircleFilled, SearchOutlined } from "@ant-design/icons";
import styles from "@/styles/components/Search.module.scss";
import PropTypes from "prop-types";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import SearchDropdownMenu from "./dashboard/SearchDropdownMenu";



const filterOptions = {
  "resource": [
    {
      label: "action",
      value: "action=",
      helpText: "Search resources with this action"
    },
    {
      label: "tenant",
      value: "tenant=",
      helpText: "Search resources in this tenant"
    }
  ],
  "role": [
    {
      label: "resource",
      value: "resource=",
      helpText: "Search roles with this resource"
    },
    {
      label: "tenant",
      value: "tenant=",
      helpText: "Search roles in this tenant"
    }
  ],
  "tenant": [
    {
      label: "user",
      value: "user=",
      helpText: "Search tenants with this user"
    }
  ],
  "user": [
    {
      label: "role",
      value: "role=",
      helpText: "Search users with this role"
    },
    {
      label: "tenant",
      value: "tenant=",
      helpText: "Search users in this tenant"
    }
  ],
  "logs": [
    {
      label: "resource",
      value: "resource=",
      helpText: "Search logs with this resource"
    },
    {
      label: "action",
      value: "action=",
      helpText: "Search logs with this action"
    },
    {
      label: "user",
      value: "user=",
      helpText: "Search logs with this user"
    },
    {
      label: "tenant",
      value: "tenant=",
      helpText: "Search logs with this tenant"
    },
  ],
}

const AdvanceSearchBar = (props) => {
  const filterType = props.filterType || null;
  const [inputValue, setInputValue] = useState(props.defaultValue || "")

  const handlePressEnter = (event) => {
    if (event.key === "Enter") {
      props.onSearch(event.target.value);
    }
  };

  const filtersSelect = (
    <Dropdown
      className={styles.filterDropdown}
      trigger={["click"]}
      dropdownRender={() => <SearchDropdownMenu items={filterOptions[filterType]} handleFilterChange={handleFilterChange} />}
    >
      <Row align="middle" className={styles.filterDropdownLabelItem}>
        <div className={styles.filterDropdownLabel}>Filters</div>
        <MdOutlineKeyboardArrowDown className={styles.filterDropdownIcon} />
      </Row>
    </Dropdown>
  )

  const handleFilterChange = (value) => {
    const currentValue = props.searchRef.current?.input?.value;
    setInputValue(`${currentValue}${currentValue ? " " : ""}${value}`)
    props.searchRef.current?.input?.focus();
  }

  return (
    <Input
      {...props}
      ref={props.searchRef}
      placeholder={props.placeholder || "Search"}
      className={`${styles.darkBugBaseSearchbar} ${props.className || ""}`}
      prefix={
        <SearchOutlined
          className={`${styles.searchIcon} site-form-item-icon `}
        />
      }
      styles={props.styles}
      addonBefore={filterType ? filtersSelect : null}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      allowClear={props.allowClear ? { clearIcon: <CloseCircleFilled className={styles.clearIcon} onClick={props.onClear} /> } : false}
      onPressEnter={handlePressEnter}

    />
  );
};

AdvanceSearchBar.propTypes = {
  placeholder: PropTypes.string,
};

export default AdvanceSearchBar;
