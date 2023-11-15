import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { Avatar, Divider, Row } from 'antd'
import { FaAddressCard } from "react-icons/fa"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import { AiTwotoneMail } from "react-icons/ai"
import { RiLockPasswordFill, RiDeleteBinLine } from "react-icons/ri"



const ManageAccount = ({setCurrentTab}) => {

    const editProfileActions = [
        {
            label: "Personal Information",
            icon: <FaAddressCard className={styles.actionIcon} />,
            onClick: () => setCurrentTab("editProfile")
        },
        {
            label: "Change Email",
            icon: <AiTwotoneMail className={styles.actionIcon} />
        },
        {
            label: "Sign-In & Security",
            icon: <RiLockPasswordFill className={styles.actionIcon} />
        }
    ]



    return (
        <div className={`${styles.manageAccountContainer} ${styles.manageAccountHasFooter}`}>
            <div className={styles.profileDetails}>
                <Avatar size={92} className={styles.avatar}>A</Avatar>
                <h2 className={styles.profileName}>Aditya Peela</h2>
                <div className={styles.profileEmail}>aditya@bugbase.in</div>
            </div>

            <div className={styles.editProfileActionsContainer}>
                <div className={styles.editProfileActionsSection}>
                    {editProfileActions.map((action, index) => (
                        <>
                            <Row key={index} justify="space-between" align="middle" className={styles.editProfileAction} onClick={action.onClick}>
                                <div className={styles.actionLeft}>
                                    {action.icon}
                                    <div className={styles.label}>{action.label}</div>
                                </div>
                                <MdOutlineKeyboardArrowRight className={styles.arrow} />
                            </Row>
                            {index !== editProfileActions.length - 1 && <Divider className={styles.actionDivider} />}
                        </>
                    ))}
                </div>
            </div>

            <div className={styles.editProfileActionsContainer}>
                <div className={styles.sectionHeading}>Danger Zone</div>
                <div className={styles.editProfileActionsSection}>
                    <Row justify="space-between" align="middle" className={styles.editProfileAction}>
                        <div className={styles.actionLeft}>
                            <RiDeleteBinLine className={styles.actionIcon} />
                            <div className={styles.label}>Delete Account</div>
                        </div>
                        <MdOutlineKeyboardArrowRight className={styles.arrow} />
                    </Row>
                </div>
            </div>

        </div>
    )
}

export default ManageAccount