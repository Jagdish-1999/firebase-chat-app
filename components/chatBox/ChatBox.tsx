"use client";
import React, { useCallback, useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import styles from "./chatBox.module.scss";
import Avatar from "../avatar/Avatar";
import {
	DocumentData,
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "@/lib/firebase";
import { useChatStore } from "@/lib/chatStore";
import { useUserStore } from "@/lib/userStore";
import { AvatarType } from "../register/Register";
import Input from "../input/Input";
import { uploadFile } from "@/lib/uploadFile";

export interface PropTypes {
	handleSendingImg(url: string): void;
	setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatBox: React.FC<PropTypes> = ({ handleSendingImg, setIsSending }) => {
	const [message, setMessage] = useState("");
	const [openEmoji, setOpenEmoji] = useState(false);
	const [img, setImg] = useState<AvatarType>({} as AvatarType);

	const { currentUser } = useUserStore();
	const { chatId, user, isReceiverBlocked, isCurrentUserBlocked } =
		useChatStore();

	const handleEmoji = useCallback((e: { emoji: string }) => {
		setMessage((prevMsg) => prevMsg + e.emoji);
		setOpenEmoji((prev) => !prev);
	}, []);

	const sendMessage = useCallback(
		async ({ file }: { file?: File }) => {
			// if (!message || !img.file) return;

			let imgUrl = null;
			if (file) {
				setIsSending(true);
				imgUrl = await uploadFile(file, () => {});
			}
			try {
				const docc = await updateDoc(doc(db, "chats", chatId), {
					messages: arrayUnion({
						senderId: currentUser.id,
						text: message,
						createdAt: new Date(),
						...(imgUrl ? { image: imgUrl } : {}),
					}),
				});

				console.log("docc", docc);
				[currentUser.id, user.id].forEach(async (id) => {
					const userChatRef = doc(db, "userchats", id);
					const userChatSnapShot = await getDoc(userChatRef);

					if (userChatSnapShot.exists()) {
						const userChatsData = userChatSnapShot.data();
						const chatIndex = userChatsData.chats.findIndex(
							(chat: DocumentData) => chat.chatId === chatId
						);

						userChatsData.chats[chatIndex].lastMessage = message;
						userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
						userChatsData.chats[chatIndex].updatedAt = Date.now();

						await updateDoc(userChatRef, {
							chats: userChatsData.chats,
						});
					}
				});
			} catch (error) {
				toast.error("Could not send message");
				console.error(error);
			} finally {
				// setIsSending(false);
			}

			setImg({} as AvatarType);
			setMessage("");
		},
		[setIsSending, chatId, currentUser.id, message, user?.id]
	);

	const handleFileClick = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			if (evt.target?.files?.[0]) {
				const url = URL.createObjectURL(evt.target.files[0]);
				setImg({
					file: evt.target.files[0],
					url,
				});
				sendMessage({ file: evt.target.files[0] });
				// handleSendingImg(url);
			}
		},
		[sendMessage]
	);

	return (
		<div className={styles.container}>
			<div className={styles.icons}>
				<div className={`${styles.avatar} ${styles.fileIcon}`}>
					<Input
						title=""
						type="file"
						fileIcon="/assets/img.png"
						name="chat-img"
						handleInput={handleFileClick}
					/>
				</div>
				<div className={styles.avatar}>
					<Avatar src="/assets/camera.png" />
				</div>
				<div className={styles.avatar}>
					<Avatar src="/assets/mic.png" />
				</div>
			</div>
			<div className={styles.chatBox}>
				<input
					placeholder={
						isCurrentUserBlocked || isReceiverBlocked
							? "You are blocked can't send message"
							: "Send a message"
					}
					value={message}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
						setMessage(evt.target.value)
					}
					onKeyDown={(evt: React.KeyboardEvent<HTMLInputElement>) => {
						if (evt.key === "Enter") sendMessage({});
					}}
					disabled={isCurrentUserBlocked || isReceiverBlocked}
				/>
			</div>
			<div className={styles.avatar}>
				<Avatar
					src="/assets/emoji.png"
					onClick={() => setOpenEmoji((prev) => !prev)}
				/>
				<div className={styles.emojiPicker}>
					<EmojiPicker open={openEmoji} onEmojiClick={(e) => handleEmoji(e)} />
				</div>
			</div>
			<div className={styles.button}>
				<button
					disabled={isCurrentUserBlocked || isReceiverBlocked}
					onClick={() => sendMessage({})}>
					Send
				</button>
			</div>
		</div>
	);
};

export default ChatBox;
