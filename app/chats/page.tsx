"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./page.module.scss";

import UserList from "@/components/userList/UserList";
import UserChats from "@/components/userChats/UserChats";
import ProfileDetails from "@/components/profileDetails/ProfileDetails";
import { listData } from "@/constants/constants";
import { useUserStore } from "@/lib/userStore";
import Loading from "@/components/loading/Loading";
import { useChatStore } from "@/lib/chatStore";
import { useRouter } from "next/navigation";

export default function ChatPage() {
	const router = useRouter();
	const [showDetails, setShowDetails] = useState<boolean>(true);
	const { chatId } = useChatStore();
	const {
		currentUser,
		isLoading: isUserLoading,
		fetchUserInfo,
	} = useUserStore();

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			router.push("/login");
		}
	}, [isUserLoading, router]);

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
					<Loading label="Loading" />
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
