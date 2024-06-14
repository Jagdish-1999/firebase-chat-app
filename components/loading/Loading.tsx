import React from "react";
import styles from "./loading.module.scss";

interface LoadingPropTypes {
	label: string;
}

const Loading: React.FC<LoadingPropTypes> = ({ label }) => {
	return <div className={styles.container}>{label || "Loading..."}</div>;
};

export default Loading;
