import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd'
import React from 'react'
import styles from "@/styles/components/Modal.module.scss"
import PrimaryButton from '../../PrimaryButton'
import formStyles from "@/styles/components/Form.module.scss"
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'



const AssignRoleModal = ({
  visible,
  setVisible,
}) => {


  const closeModal = () => {
    setVisible(false)
  }

  const tenantOptions = [
    {
      label: "Default Tenant",
      value: "default"

    },
    {
      label: "Tenant 1",
      value: "tenant1"

    },
    {
      label: "Tenant 2",
      value: "tenant2"

    }
  ]



  const roleOptions = [
    {
      label: "Admin",
      value: "admin"

    },
    {
      label: "User",
      value: "user"

    },
    {
      label: "Viewer",
      value: "viewer"
    }
  ]



  return (
    <Modal
      open={visible}
      onCancel={closeModal}
      centered
      closeIcon={null}
      footer={null}
      className={styles.appModalContainer}
      width={600}
    >
      <div className={styles.appModalWrapper}>
        <div className={styles.modalHeader}>
          <h1 className={styles.heading}>Assign Role to User</h1>
        </div>
        <Form className={`${formStyles.formContainer} ${styles.modalForm}`} layout='vertical'>
          <Form.Item
            name="user"
            label="User"
            className={formStyles.formItem}
          >
            <Input className={`${formStyles.formInput} ${styles.modalInput}`} defaultValue='Aditya Peela (aditya@bugbase.in)' disabled />
          </Form.Item>
          <Form.Item
            name="userKey"
            label="User Key"
            className={formStyles.formItem}
          >
            <Input className={`${formStyles.formInput} ${styles.modalInput}`} defaultValue='aditya@bugbase.in' disabled />
          </Form.Item>
          <Form.Item
            label={
              <Row align="middle" style={{ width: "100%" }}>
                <Col span={11}>
                  <label>Tenant</label>
                </Col>
                <Col span={11}>
                  <label>Assigned Role</label>
                </Col>
              </Row>
            } className={`${formStyles.formItem} ${formStyles.formItemLabelRow}`}>
            <Form.List name="list">
              {(subFields, subOpt) => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: "1rem"
                  }}
                >
                  {subFields.map((subField) => (
                    <Row align="middle" key={subField.key} className={`${formStyles.formListRow}`}>
                      <Col span={11} className={`${formStyles.formListCol}`}>
                        <Form.Item noStyle name={[subField.name, 'tenant']} >
                          <Select
                            style={{ width: '100%' }}
                            placeholder="Select Tenant"
                            className={`${formStyles.formSelect} ${styles.modalInput}`}
                            options={tenantOptions}
                            showSearch
                            defaultValue={"default"}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={11} className={`${formStyles.formListCol}`}>
                        <Form.Item noStyle name={[subField.name, 'role']}>
                          <Select
                            style={{ width: '100%' }}
                            placeholder="Assign Role"
                            className={`${formStyles.formSelect} ${styles.modalInput}`}
                            options={roleOptions}
                            showSearch
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2} className={`${formStyles.formListRowClose}`}>

                        <PrimaryButton
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                          buttonType="text"
                          color="primary"
                          icon={<CloseOutlined
                          />} />
                      </Col>
                    </Row>
                  ))}
                  <PrimaryButton buttonType="text" onClick={() => subOpt.add()} icon={<PlusOutlined />} className={formStyles.formListAddButton}>
                    Duplicate User into a new tenant
                  </PrimaryButton>
                </div>
              )}
            </Form.List>
          </Form.Item>

          <Row justify="end" className={styles.modalButtonsContainer}>
            <PrimaryButton
              size="small"
              buttonType="text"
              className={`${styles.formButton} ${styles.modalCancelButton}`}
              onClick={closeModal}
            >Cancel</PrimaryButton>
            <PrimaryButton
              size="small"
              className={`${styles.formButton} ${styles.modalButton}`}
              htmlType='submit'
            >Done</PrimaryButton>
          </Row>
        </Form>
      </div>
    </Modal>
  )
}

export default AssignRoleModal