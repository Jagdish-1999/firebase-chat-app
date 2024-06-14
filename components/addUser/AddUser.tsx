import React, { useCallback, useState } from "react";
import {
	arrayUnion,
	collection,
	doc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";

import styles from "./addUser.module.scss";
import Input from "../input/Input";
import { UserDataType } from "@/constants/constants";
import { toast } from "react-toastify";
import { Button } from "../button/Button";
import Avatar from "../avatar/Avatar";
import { db } from "@/lib/firebase";
import { useUserStore } from "@/lib/userStore";

interface PropTypes {
	closeAddUserModal(): void;
	bacKDropClick(): void;
}
interface QueryStringType {
	value: string;
}
const emptyQuery = {
	value: "",
};

const AddUser: React.FC<PropTypes> = ({ closeAddUserModal, bacKDropClick }) => {
	const [queryString, setQueryString] = useState<QueryStringType>(
		{} as QueryStringType
	);
	const [user, setUser] = useState<React.ReactNode[]>();

	const { currentUser } = useUserStore();

	const addUserFun = useCallback(
		async (uid: string) => {
			const chatRef = collection(db, "chats");
			const userChatRef = collection(db, "userchats");

			try {
				const newChatRef = doc(chatRef);
				await setDoc(newChatRef, {
					createdAt: serverTimestamp(),
					messages: [],
				});
				await updateDoc(doc(userChatRef, uid), {
					chats: arrayUnion({
						chatId: newChatRef.id,
						lastMessage: "",
						receiverId: currentUser.id,
						updatedAt: Date.now(),
					}),
				});
				await updateDoc(doc(userChatRef, currentUser.id), {
					chats: arrayUnion({
						chatId: newChatRef.id,
						lastMessage: "",
						receiverId: uid,
						updatedAt: Date.now(),
					}),
				});
				toast.success("User chats addes successfully");
				setQueryString(emptyQuery);
				setUser([]);
				closeAddUserModal();
			} catch (error) {
				toast.error("Error occur while adding user");
				console.error("Error while adding user: ", error);
			}
		},
		[closeAddUserModal, currentUser.id]
	);

	const searchUsers = useCallback(
		async (queryString: string) => {
			if (!queryString.trim()) {
				setUser([]);
				return;
			}
			try {
				const userCollectionRef = collection(db, "users");
				const q = query(
					userCollectionRef,
					where("username", "<=", queryString)
				);

				const querySnapShot = await getDocs(q);
				if (!querySnapShot.empty) {
					setUser([]);
					querySnapShot.forEach((eachUser) => {
						const current = eachUser.data();
						if (current.id !== currentUser.id) {
							const node = (
								<div
									key={current.email}
									className={styles.eachUser}
									onClick={() => addUserFun(current.id)}>
									<div className={styles.avatarNName}>
										<div className={styles.avatar}>
											<Avatar
												src={current.avatar || "/assets/avatar.png"}
												width={35}
												height={35}
											/>
										</div>
										<div className={styles.name}>{current.username}</div>
									</div>
									<div className={styles.plus}>
										<Avatar src="/assets/plus.png" width={15} height={15} />
									</div>
								</div>
							);
							setUser((prev) => (prev ? [...prev, node] : [node]));
						}
					});
				} else toast.warn("No user found");
			} catch (error) {
				toast.error("User not added");
				console.error("Error while searching", error);
			}
		},
		[addUserFun, currentUser.id]
	);

	const handleInput = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			if (evt.target.value) setQueryString({ value: evt.target.value });
			else setQueryString(emptyQuery);
		},
		[]
	);

	return (
		<div
			className={styles.addUserForm}
			onClick={(e) => {
				e.stopPropagation();
				bacKDropClick();
			}}>
			<div
				className={styles.addUserContainer}
				onClick={(e) => e.stopPropagation()}>
				<div className={styles.form}>
					<div className={styles.inputContainer}>
						<Input
							type="search"
							title="Search Username"
							name="adduser"
							value={queryString as QueryStringType}
							handleInput={handleInput}
							handleEnterPress={() => searchUsers(queryString.value)}
						/>
					</div>
					<div className={styles.buttonContainer}>
						<Button
							label="Search"
							disabled={!queryString}
							onClick={() => searchUsers(queryString.value)}
						/>
					</div>
				</div>
				<div className={`${styles.searchedList} scrollbar`}>{user}</div>
			</div>
		</div>
	);
};

export default AddUser;
