import { Card, Divider, Row } from 'antd'
import React from 'react'
import styles from "@/styles/components/Header.module.scss";
import { TbUserEdit } from 'react-icons/tb';
import { AiOutlineLogout } from 'react-icons/ai'
import { LuExternalLink } from 'react-icons/lu'


const ProfileDropdown = ({ handleLogout, setManageAccountModalVisible }) => {




    const dropdownItems = [
        {
            icon: <TbUserEdit className={styles.icon} />,
            label: `Edit Profile`,
            onClick: () => setManageAccountModalVisible(true)
        },
        {
            icon: <AiOutlineLogout className={styles.icon} />,
            label: `Logout`,
            onClick: () => handleLogout()
        },
        {
            icon: <LuExternalLink className={styles.icon} />,
            label: `Documentation`,
            onClick: () => console.log("Documentation Clicked")
        }
    ]


    return (
        <Card className={styles.profileDropdownCard}>
            {dropdownItems.map((item, index) => (
                <>
                    {index === dropdownItems.length - 1 && <Divider className={styles.divider} />}
                    <Row align="middle" className={styles.profileItem} onClick={item.onClick} key={index}>
                        {item.icon}
                        <div className={styles.profileItemName}>{item.label}</div>
                    </Row>
                </>
            ))}
        </Card>
    )
}

export default ProfileDropdown