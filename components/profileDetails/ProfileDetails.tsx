import React, { useCallback } from "react";
import styles from "./profileDetails.module.scss";
import Avatar from "../avatar/Avatar";
import DropDown from "../dropDown/DropDown";
import { profileDetails } from "@/constants/constants";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { useChatStore } from "@/lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useUserStore } from "@/lib/userStore";

interface PropTypes {}

const ProfileDetails: React.FC<PropTypes> = () => {
	const router = useRouter();
	const { changeBlock, user, isReceiverBlocked, isCurrentUserBlocked } =
		useChatStore();
	const { currentUser } = useUserStore();

	const handleBlockUser = useCallback(async () => {
		if (!user) return;

		const userDocRef = doc(db, "users", currentUser.id);

		try {
			await updateDoc(userDocRef, {
				blockedUsers: isReceiverBlocked
					? arrayRemove(user.id)
					: arrayUnion(user.id),
			});
			changeBlock();
		} catch (error) {
			toast.error("Error when blocking user");
			console.error(error);
		}
	}, [changeBlock, currentUser.id, isReceiverBlocked, user]);

	return (
		<div className={styles.container}>
			<div className={styles.detailsContainer}>
				<div className={styles.avatarContainer}>
					<div className={styles.avatar}>
						<Avatar src={user?.avatar || "/assets/avatar.png"} />
					</div>
					<div className={styles.name}>
						<div>{user?.username}</div>
						<div>{user?.status || "every day is a new beginning"}</div>
					</div>
				</div>
				<div className={`scrollbar ${styles.dropDown}`}>
					{profileDetails.map((eachItem) => (
						<DropDown key={eachItem.id} title={eachItem.title} />
					))}
				</div>
			</div>
			<div className={styles.buttons}>
				<div className={styles.blocked} onClick={handleBlockUser}>
					{isCurrentUserBlocked
						? "You are blocked"
						: isReceiverBlocked
						? "User Blocked"
						: "Block User"}
				</div>
				<div
					className={styles.logout}
					onClick={() => {
						auth.signOut();
						localStorage.setItem("accessToken", "");
						toast.success("User Logout successfully");
						router.push("/login");
					}}>
					Logout
				</div>
			</div>
		</div>
	);
};

export default ProfileDetails;
