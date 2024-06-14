"use client";
import React from "react";

import styles from "./bg.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const Bg = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className={styles.main}>
			{children}
			<ToastContainer theme="dark" autoClose={1000} />
		</main>
	);
};

export default Bg;
