"use client"

import React, { useState } from 'react'
import styles from "@/styles/components/Sidebar.module.scss";
import { Avatar, Card, Divider, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SearchBar from '../SearchBar';
import CreateProjectModal from '../modals/CreateProjectModal';
import { useRouter } from 'next/navigation';


const ProjectDropdown = ({ projects, currentProject }) => {
    const router = useRouter();
    const [projectModal, setProjectModal] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState(projects);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = projects.filter(project => project.projectName.toLowerCase().includes(value) || project.projectKey.toLowerCase().includes(value));
        setFilteredProjects(filtered);
    }

    const handleClick = (projectKey) => {
        router.push(`/${projectKey}`)
    }


    return (
        <>
            <Card className={styles.projectDropdownCard}>
                <div className={styles.projectSearch}>
                    <SearchBar onChange={handleSearch} placeholder='Search projects' className={styles.searchBar} />
                </div>
                {filteredProjects.map((project, index) => (
                    <Row align="middle" key={index} className={`${styles.projectDetailsSection} ${project.projectKey === currentProject.projectKey && styles.projectDetailsSectionActive}`} onClick={() => handleClick(project.projectKey)}>
                        <Avatar className={styles.detailAvatar} shape='square'>{project.projectName[0]}</Avatar>
                        <div className={styles.projectDetails}>
                            <div className={styles.projectDetailName}>{project.projectName}</div>
                            <div className={styles.projectDetailKey}>{project.projectKey}</div>
                        </div>
                    </Row>
                ))}
                <Divider className={styles.divider} />
                <Row onClick={() => {
                    setProjectModal(true);
                }} align="middle" className={`${styles.projectDetailsSection} ${styles.createProjectBtn}`}>
                    <div className={styles.projectDetails}>
                        <div className={styles.projectDetailName}><PlusOutlined />Create New Project</div>
                    </div>
                </Row>
            </Card>
            <CreateProjectModal visible={projectModal} setVisible={setProjectModal} />
        </>
    )
}

export default ProjectDropdown