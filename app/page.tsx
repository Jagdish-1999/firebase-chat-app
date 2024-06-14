"use client";
import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
	return (
		<div className={styles.container}>
			<Link href="/login">
				<h1>Login to start a new chat</h1>
			</Link>
		</div>
	);
}
