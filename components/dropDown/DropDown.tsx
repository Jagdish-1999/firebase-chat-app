"use client";
import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import styles from "./dropDown.module.scss";

export interface PropTypes {
	title: string;
}

const DropDown: React.FC<PropTypes> = ({ title }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className={styles.container}>
			<div
				className={`${isExpanded ? styles["selected"] : ""} ${styles.expander}`}
				onClick={() => setIsExpanded((prev) => !prev)}>
				<div className={styles.dropDownTitle}>{title}</div>
				<div
					className={`${styles["avatar"]} ${isExpanded ? "" : styles.rotate}`}>
					<Avatar src="/assets/arrowUp.png" />
				</div>
			</div>
			<div
				className={`${styles["content"]} ${
					isExpanded ? "" : styles.collapse
				}`}></div>
		</div>
	);
};

export default DropDown;
