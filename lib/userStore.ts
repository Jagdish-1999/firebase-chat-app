import { DocumentData, doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

interface UseUserStateTypes {
	currentUser: DocumentData;
	isLoading: boolean;
	fetchUserInfo(uid: string | undefined): void;
}

const initialUserState = {
	id: "",
	username: "",
	blockedUsers: [],
	email: "",
	avatar: "",
};

export const useUserStore = create<UseUserStateTypes>((set) => ({
	currentUser: initialUserState,
	isLoading: true,

	async fetchUserInfo(uid) {
		if (!uid) {
			return set(() => ({ currentUser: initialUserState, isLoading: false }));
		}

		try {
			const docRef = doc(db, "users", uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				return set(() => ({
					currentUser: docSnap.data(),
					isLoading: false,
				}));
			} else {
				return set(() => ({ currentUser: initialUserState, isLoading: false }));
			}
		} catch (error) {}
	},
}));
