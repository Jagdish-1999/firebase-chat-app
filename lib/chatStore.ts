import { DocumentData, doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { useUserStore } from "./userStore";

// TODO provide proper type
interface UseChatStateTypes {
	chatId: string;
	user: any;
	isCurrentUserBlocked: boolean;
	isReceiverBlocked: boolean;
	changeChat(chatId: string, user: any): void;
	changeBlock(): void;
}

export const useChatStore = create<UseChatStateTypes>((set) => ({
	chatId: "",
	user: null,
	isCurrentUserBlocked: false,
	isReceiverBlocked: false,

	changeChat(chatId, user) {
		const currentUser = useUserStore.getState().currentUser;

		// CHECK IF CURRENT  USER IS BLOCKED
		if (user.blockedUsers.includes(currentUser.id)) {
			return set({
				chatId,
				user: null,
				isCurrentUserBlocked: true,
				isReceiverBlocked: false,
			});
		}
		// CHECK IF RECEIVER IS BLOCKED
		else if (currentUser.blockedUsers.includes(user.id)) {
			return set({
				chatId,
				user,
				isCurrentUserBlocked: false,
				isReceiverBlocked: true,
			});
		}
		// SET STATE IF ALL GOOD
		else {
			return set({
				chatId,
				user,
				isCurrentUserBlocked: false,
				isReceiverBlocked: false,
			});
		}
	},

	changeBlock() {
		return set((state) => ({
			...state,
			isReceiverBlocked: !state.isReceiverBlocked,
		}));
	},
}));
