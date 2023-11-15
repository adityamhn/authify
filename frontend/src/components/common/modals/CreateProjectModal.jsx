import React from 'react'
import { Form, Input, Modal, Row, message } from 'antd'
import PrimaryButton from '@/components/common/PrimaryButton'
import styles from "@/styles/components/Modal.module.scss"
import formStyles from "@/styles/components/Form.module.scss"
import { BiInfoCircle } from 'react-icons/bi'
import { useMutation } from 'react-query'
import { createNewProject } from '@/services/project.service'
import { roleAndResourceRegex } from '@/services/constants'
import { useRouter } from 'next/navigation'

const CreateProjectModal = ({
  visible,
  setVisible,
}) => {
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage();

  const createProjectMutation = useMutation(createNewProject, {
    onSuccess: (data) => {
      messageApi.success('Project created successfully')

      if (data.projectKey) {
        router.push(`/${data.projectKey}`)
      }
    }

  })


  const handleCreateProject = async (values) => {

    await createProjectMutation.mutateAsync({
      projectName: values.projectName,
      projectKey: values.projectKey,
    })
    setVisible(false)
  }


  return (
    <>
      {contextHolder}
      <Modal
        open={visible}
        centered
        closeIcon={null}
        footer={null}
        className={styles.createProjectModalContainer}
        width={580}
      >
        <div className={styles.createProjectModalWrapper}>
          <Row justify="end" className={styles.cancelButton} onClick={() => setVisible(false)}>
            Cancel
          </Row>
          <div className={styles.modalHeader}>
            <h1 className={styles.heading}>Create New Project</h1>
            <p className={styles.subHeading}>Build a robust Authorization mechanism for your application in minutes,</p>
          </div>
          <Form className={`${formStyles.formContainer} ${styles.createForm}`} layout='vertical' onFinish={handleCreateProject}>
            <Form.Item
              name="projectName"
              label="Project Name"
              className={formStyles.formItem}
              extra="Enhance readability with a user-friendly name for your Project. "
              rules={[
                {
                  required: true,
                  message: 'Please input your Project Name!',
                },
              ]}
            >
              <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example :  My First Project' />
            </Form.Item>
            <Form.Item
              name="projectKey"
              label={<Row align="middle" style={{ gap: 8 }}><label>Project Key</label><BiInfoCircle className={formStyles.infoIcon} /></Row>}
              className={formStyles.formItem}
              extra="Key is an identifier for API interactions, simplifying SDK integration and usage."
              rules={[
                {
                  required: true,
                  message: 'Please input your Project Key!',
                },
                {
                  pattern: roleAndResourceRegex,
                  message: 'Key must only consist of lowercase letters, numeric digits, hyphens, or underscores.',
                }
              ]}
            >
              <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder='Example : my-first-project' />
            </Form.Item>
            <PrimaryButton
              className={formStyles.formButton}
              htmlType='submit'
              loading={createProjectMutation.isLoading}
            >Create Project</PrimaryButton>
          </Form>
        </div>
      </Modal>
    </>

  )
}

export default CreateProjectModal