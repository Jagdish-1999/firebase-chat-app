"use client";
import { toast } from "react-toastify";
import styles from "./page.module.scss";

export default function Home() {
	toast.success("Home page");

	return (
		<div className={styles.container}>
			<h1>Home Page</h1>
		</div>
	);
}
