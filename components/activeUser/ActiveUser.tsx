import React from "react";
import styles from "./activeUser.module.scss";
import Avatar from "../avatar/Avatar";
import { useChatStore } from "@/lib/chatStore";

interface PropTypes {
	setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserChat: React.FC<PropTypes> = ({ setShowDetails }) => {
	const { changeBlock, user, chatId, isReceiverBlocked, isCurrentUserBlocked } =
		useChatStore();

	return (
		<div className={styles.container}>
			<div className={styles.avatarContainer}>
				<div className={styles.avatar}>
					<Avatar
						src={user?.avatar || "/assets/avatar.png"}
						width={50}
						height={50}
					/>
				</div>
				<div className={styles.name}>
					<div>{user?.username}</div>
					<div>{user?.status || "every day is a new beginning"}</div>
				</div>
			</div>
			<div className={styles.icons}>
				<Avatar src="/assets/phone.png" width={20} height={20} />
				<Avatar src="/assets/video.png" width={20} height={20} />
				<Avatar
					src="/assets/info.png"
					width={20}
					height={20}
					onClick={() => setShowDetails((prev) => !prev)}
				/>
			</div>
		</div>
	);
};

export default UserChat;
