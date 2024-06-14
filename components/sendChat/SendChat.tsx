"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChatTypes } from "@/constants/constants";
import { ImageFullView } from "../imageFullView/ImageFullView";
import ChatImage from "../chatImage/ChatImage";
import styles from "./sendChat.module.scss";
import { DocumentData } from "firebase/firestore";
import { useUserStore } from "@/lib/userStore";
import Avatar from "../avatar/Avatar";

export interface PropTypes {
	message: DocumentData;
	fullImageViewUrl: string;
	isReceivedChat: boolean;
	setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
	setFullImageViewUrl(url: string): void;
}

const SendedChat: React.FC<PropTypes> = ({
	message,
	setIsSending,
	isReceivedChat,
	fullImageViewUrl,
	setFullImageViewUrl,
}) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const { currentUser } = useUserStore();

	const handleChatImageClick = useCallback(
		(imgUrl: string) => {
			setFullImageViewUrl(imgUrl);
		},
		[setFullImageViewUrl]
	);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		if (message.image) setIsSending(false);
	}, [setIsSending, message]);

	return (
		<div
			className={`${styles.container} ${
				isReceivedChat ? styles.incomingChat : ""
			}`}
			ref={scrollRef}>
			<div className={styles.chatContainer}>
				{message?.image && (
					<div className={styles.sendingImg}>
						<ChatImage imgUrl={message.image} onClick={handleChatImageClick} />
					</div>
				)}
				{message.text && <div className={styles.chat}>{message.text}</div>}
				{message.time && <div className={styles.time}>{message.time}</div>}
			</div>
			{fullImageViewUrl && (
				<ImageFullView
					chatImage={fullImageViewUrl}
					setFullImageView={setFullImageViewUrl}
				/>
			)}
		</div>
	);
};

export default SendedChat;
