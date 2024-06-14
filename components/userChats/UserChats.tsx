import React, { useCallback, useEffect, useState } from "react";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";

import { SENDER } from "@/constants/constants";
import styles from "./userChats.module.scss";
import ChatBox from "../chatBox/ChatBox";
import ActiveUser from "../activeUser/ActiveUser";
import SendChat from "@/components/sendChat/SendChat";
import IncomingChat from "@/components/incomingChat/IncomingChat";
import { db } from "@/lib/firebase";
import { useUserStore } from "@/lib/userStore";
import { useChatStore } from "@/lib/chatStore";
import { toast } from "react-toastify";
import ChatImage from "../chatImage/ChatImage";
import Loading from "../loading/Loading";

interface PropTypes {
	setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserChats: React.FC<PropTypes> = ({ setShowDetails }) => {
	const [sendingImg, setSendingImg] = useState<string>("");
	const [chats, setChats] = useState<DocumentData>({});
	const [fullImageViewUrl, setFullImageViewUrl] = useState<string>("");
	const [isSending, setIsSending] = useState<boolean>(false);

	const { currentUser } = useUserStore();
	const { chatId, user } = useChatStore();

	useEffect(() => {
		let unSubscribe: () => void;
		try {
			if (chatId) {
				unSubscribe = onSnapshot(doc(db, "chats", chatId), (res) => {
					const data = res.data();
					data && setChats(data);
				});
			}
		} catch (error) {
			toast.error("Error when fetching chat user");
			console.error(error);
		}

		// CLEAN UP FUNCTION TO UNSUBSCRIBE
		return () => {
			unSubscribe && unSubscribe();
		};
	}, [chatId]);

	return (
		<div className={styles.container}>
			<ActiveUser setShowDetails={setShowDetails} />
			<div className={`scrollbar ${styles.middleContainer}`}>
				<>
					{chats.messages?.map((message: DocumentData) => (
						<SendChat
							message={message}
							key={message.createdAt}
							setIsSending={setIsSending}
							fullImageViewUrl={fullImageViewUrl}
							setFullImageViewUrl={setFullImageViewUrl}
							isReceivedChat={message.senderId !== currentUser.id}
						/>
					))}
					{isSending && (
						<div className={styles.sendingImg}>
							<Loading label="Sending" />
						</div>
					)}
				</>
			</div>
			<ChatBox handleSendingImg={setSendingImg} setIsSending={setIsSending} />
		</div>
	);
};

export default UserChats;
