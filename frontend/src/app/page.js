import React from "react";
import styles from "@/styles/pages/Home.module.scss";
import { Row } from "antd";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <Row justify="end" className={styles.navbar}>
        <a href="/auth">Login to Authify</a>
      </Row>
    </div>
  );
};

export default Home;
