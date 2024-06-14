"use client";

import React, { useEffect, useRef } from "react";
import styles from "./incomingChat.module.scss";
import Avatar from "../avatar/Avatar";
import { ChatTypes } from "@/constants/constants";
import { DocumentData } from "firebase/firestore";

export interface PropTypes {
	message: DocumentData;
}
const IncomingChat: React.FC<PropTypes> = ({ message }) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);
	return (
		<div className={styles.container} ref={scrollRef}>
			<div className={styles.avatar}>
				<Avatar src="/assets/avatar.png" />
			</div>
			<div className={styles.chatContainer}>
				<div className={styles.chat}>{message.text}</div>
				<div className={styles.time}>{message.time}</div>
			</div>
		</div>
	);
};

export default IncomingChat;
