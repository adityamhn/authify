import React, { useState } from 'react'
import { Modal, Row } from 'antd'
import styles from "@/styles/components/Modal.module.scss"
import ManageAccount from '../dashboard/manageAccount/ManageAccount';
import { MdKeyboardArrowLeft } from "react-icons/md"
import EditPersonalInformation from '../dashboard/manageAccount/EditPersonalInformation';
import PrimaryButton from '../PrimaryButton';


const ManageAccountModal = ({
    visible,
    setVisible,
    handleLogout
}) => {
    const [currentTab, setCurrentTab] = useState("profile");


    const closeModal = () => {
        setVisible(false)
    }

    const renderModalHeading = () => {
        switch (currentTab) {
            case "profile":
                return "My Account"
            case "editProfile":
                return "Personal Information"
            default:
                return "My Account"
        }
    }


    return (
        <Modal
            open={visible}
            centered
            closeIcon={null}
            footer={null}
            className={`${styles.createProjectModalContainer} ${styles.editProfileModalContainer}`}
            width={580}
        >
            <div className={styles.editProfileModalWrapper}>
                <Row justify="space-between" className={styles.headerRow}>
                    <Row align="middle" className={styles.headerLeft}>
                        <div className={styles.modalHeading}>{renderModalHeading()}</div>
                    </Row>
                    <div className={styles.cancelButton} onClick={() => setVisible(false)}>Cancel</div>
                </Row>
                {currentTab === "profile" ?
                    <ManageAccount setCurrentTab={setCurrentTab} /> :
                    currentTab === "editProfile" ?
                        <EditPersonalInformation /> : null}

                <Row justify={currentTab !== "profile" ? "center" : "end"} className={styles.editProfileActionsFooter}>
                    {currentTab !== "profile" ?
                        <PrimaryButton buttonType="text" size="small" className={styles.goBackButton} icon={<MdKeyboardArrowLeft />} onClick={() => setCurrentTab("profile")}>Go back</PrimaryButton> :
                        <PrimaryButton size="small" className={styles.logoutButton} onClick={() => {
                            closeModal()
                            handleLogout()
                        }}>Logout</PrimaryButton>}
                </Row>
            </div>
        </Modal>

    )
}

export default ManageAccountModal