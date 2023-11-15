import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import { Avatar, Divider, Row } from 'antd'
import PrimaryButton from '../../PrimaryButton'
import {  MdOutlineKeyboardArrowRight } from 'react-icons/md'


const EditPersonalInformation = () => {
    return (
        <div className={styles.manageAccountContainer}>

            <div className={styles.editProfileActionsContainer}>
                <div className={styles.editProfileActionsSection}>
                    <Row justify="space-between" align="middle" className={`${styles.editProfileAction} ${styles.editProfileActionHasButton}`}>
                        <div className={styles.actionLeft}>
                            <Avatar size={24} >A</Avatar>
                            <div className={styles.label}>Profile Image</div>
                        </div>
                        <PrimaryButton buttonType="text" className={styles.editButton}>
                            edit
                            <MdOutlineKeyboardArrowRight className={styles.arrow} />
                        </PrimaryButton>

                    </Row>
                    <Divider className={styles.actionDivider} />
                    <Row justify="space-between" align="middle" className={`${styles.editProfileAction} ${styles.editProfileActionHasButton}`}>
                        <div className={styles.actionLeft}>
                            {/* <HiOutlineIdentification className={styles.actionIcon}  /> */}
                            <div className={styles.label}>Name</div>
                        </div>
                        <PrimaryButton buttonType="text" className={styles.editButton}>
                            Aditya Peela
                            <MdOutlineKeyboardArrowRight className={styles.arrow} />
                        </PrimaryButton>
                    </Row>
                    <Divider className={styles.actionDivider} />
                    <Row justify="space-between" align="middle" className={`${styles.editProfileAction} ${styles.editProfileActionHasButton}`}>
                        <div className={styles.actionLeft}>
                            {/* <HiOutlineIdentification className={styles.actionIcon}  /> */}
                            <div className={styles.label}>Date of Birth</div>
                        </div>
                        <PrimaryButton buttonType="text" className={styles.editButton}>
                            8th Feb 2003
                            <MdOutlineKeyboardArrowRight className={styles.arrow} />
                        </PrimaryButton>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default EditPersonalInformation