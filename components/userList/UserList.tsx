"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
	DocumentData,
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";

import Image from "next/image";
import styles from "./userList.module.scss";
import Avatar from "../avatar/Avatar";
import { UserDataType } from "@/constants/constants";
import AddUser from "../addUser/AddUser";
import { debounce } from "@/utils/debounce";
import { useUserStore } from "@/lib/userStore";
import { db } from "@/lib/firebase";
import Input from "../input/Input";
import { toast } from "react-toastify";
import { useChatStore } from "@/lib/chatStore";

interface PropTypes {
	listData: UserDataType[];
}

const LeftContainer: React.FC<PropTypes> = ({ listData }) => {
	const [selectedUser, setSelectedUser] = useState<string>("");
	const [userList, setUserList] = useState<DocumentData[]>([]);
	const [addUserMode, setAddUserMode] = useState<boolean>(false);

	const { currentUser } = useUserStore();
	const { changeChat } = useChatStore();

	useEffect(() => {
		let unSubscribe: () => void;
		if (currentUser.id) {
			try {
				unSubscribe = onSnapshot(
					doc(db, "userchats", currentUser.id),
					async (res) => {
						const data = res.data()?.chats as DocumentData[];
						const promisses = data?.map(async (chatItem) => {
							const userDocRef = doc(db, "users", chatItem.receiverId);
							const userDocSnap = await getDoc(userDocRef);
							const user = userDocSnap.data();
							return { ...chatItem, user };
						});
						if (promisses) {
							const chatData = await Promise.all(promisses);
							setUserList(
								chatData.sort(
									(a: DocumentData, b: DocumentData) =>
										b.updatedAt - a.updatedAt
								)
							);
						}
					}
				);
			} catch (error) {
				toast.error("Error occur when fetching user list");
				console.error(error);
			}
		}

		return () => {
			unSubscribe && unSubscribe();
		};
	}, [currentUser.id]);

	const searchUser = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {},
		[]
	);

	const closeAddUserModal = useCallback(() => {
		setAddUserMode((prev) => !prev);
	}, []);

	const handleUserSelect = useCallback(
		async (chatUser: DocumentData) => {
			const userChats = userList.map(({ user, ...rest }) => {
				return rest;
			});
			const chatIndex = userChats.findIndex(
				(chat) => chat.chatId === chatUser.chatId
			);
			userChats[chatIndex].isSeen = true;

			const userChatRef = doc(db, "userchats", currentUser.id);

			try {
				await updateDoc(userChatRef, {
					chats: userChats,
				});
				changeChat(chatUser.chatId, chatUser.user);
			} catch (error) {
				toast.error("Error when updating last seen");
				console.error(error);
			}
		},
		[changeChat, currentUser.id, userList]
	);

	return (
		<div className={styles.container}>
			<div className={styles.leftProfileContainer}>
				<div className={styles.profile}>
					<div className={styles.profileImage}>
						<Avatar
							src={currentUser.avatar || "/assets/avatar.png"}
							width={40}
							height={40}
						/>
					</div>
					<div className={styles.name}>{currentUser.username}</div>
				</div>
				<div className={styles.icons}>
					<Image
						src="/assets/more.png"
						alt="profile"
						width={20}
						height={20}
						priority
					/>
					<Image
						src="/assets/video.png"
						alt="profile"
						width={20}
						height={20}
						priority
					/>
					<Image
						src="/assets/edit.png"
						alt="profile"
						width={20}
						height={20}
						priority
					/>
				</div>
			</div>
			<div className={styles.searchBarContainer}>
				<div className={styles.inputDiv}>
					<Input
						type="search"
						title="Search"
						name="search"
						handleInput={searchUser}
					/>
				</div>
				<div
					className={styles.plus}
					onClick={() => setAddUserMode((prev) => !prev)}>
					<Image
						src={addUserMode ? "/assets/minus.png" : "/assets/plus.png"}
						alt="search"
						width={20}
						height={20}
						priority
					/>
				</div>
			</div>
			<div className={`${styles.listContainer} scrollbar`}>
				<ul>
					{userList?.map((chatUser: DocumentData) => {
						return (
							<li
								key={chatUser.updatedAt}
								className={`${
									selectedUser === chatUser.id ? styles.selectedUser : ""
								} ${!chatUser.isSeen ? styles.seenMessage : ""} ${styles.list}`}
								onClick={() => handleUserSelect(chatUser)}>
								<div className={styles.listAvatar}>
									<Avatar src={chatUser.user.avatar} width={20} height={20} />
								</div>
								<div className={styles.listName}>
									<div>{chatUser.user.username}</div>
									<div>{chatUser.lastMessage || "looks good"}</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
			{addUserMode && (
				<AddUser
					closeAddUserModal={closeAddUserModal}
					bacKDropClick={() => setAddUserMode((prev) => !prev)}
				/>
			)}
		</div>
	);
};

export default LeftContainer;
