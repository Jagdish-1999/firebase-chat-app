"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./page.module.scss";

import { ChatTypes, Chats } from "@/constants/constants";
import UserList from "@/components/userList/UserList";
import UserChats from "@/components/userChats/UserChats";
import ProfileDetails from "@/components/profileDetails/ProfileDetails";
import { listData } from "@/constants/constants";
import { useUserStore } from "@/lib/userStore";
import Loading from "@/components/loading/Loading";
import { DocumentData } from "firebase/firestore";
import { useChatStore } from "@/lib/chatStore";

export default function ChatPage() {
	const [showDetails, setShowDetails] = useState<boolean>(true);
	const { chatId } = useChatStore();
	const {
		currentUser,
		isLoading: isUserLoading,
		fetchUserInfo,
	} = useUserStore();

	useEffect(() => {
		const unSubscribe = onAuthStateChanged(auth, (user) => {
			fetchUserInfo(user?.uid);
		});
		return () => {
			unSubscribe();
		};
	}, [currentUser.id, fetchUserInfo]);

	return (
		<div className={styles.bg}>
			<div
				className={`${styles.container} ${
					isUserLoading && !currentUser.id ? styles.bgTransparent : ""
				}`}>
				{isUserLoading && !currentUser.id ? (
					<Loading />
				) : (
					<>
						<div className={styles.leftUserListContainer}>
							<UserList listData={listData} />
						</div>
						{chatId && (
							<>
								<div className={styles.userChatsContainer}>
									<UserChats setShowDetails={setShowDetails} />
								</div>
								<div
									className={`${
										showDetails ? styles.animateRight : styles.animateLeft
									} ${styles.rightProfileDetails}`}>
									<ProfileDetails />
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
