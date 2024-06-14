export interface UserDataType {
	id: string;
	src: string;
	name: string;
	status: string;
}

export const listData: UserDataType[] = [
	{
		id: "1",
		src: "/assets/avatar.png",
		name: "jagdish chandra",
		status: "looks good",
	},
	{
		id: "2",
		src: "/assets/avatar.png",
		name: "ram",
		status: "same here",
	},
	{
		id: "3",
		src: "/assets/avatar.png",
		name: "krishna ",
		status: "looks good",
	},
];

export interface ProfileDetailsTypes {
	id: string;
	title: string;
}

export const profileDetails: ProfileDetailsTypes[] = [
	{
		id: "1",
		title: "Chat settings",
	},
	{
		id: "2",
		title: "Privacy & help",
	},
	{
		id: "3",
		title: "Shared photos",
	},
	{
		id: "4",
		title: "Shared files",
	},
	{
		id: "5",
		title: "Messages",
	},
];

export interface ChatTypes {
	id: string;
	userType: string;
	image?: string;
	message?: string;
	time: string;
}
export const SENDER = "sender";
export const RECEIVER = "receiver";

export const Chats = [
	{
		id: "1",
		userType: SENDER,
		message: "Hi",
		time: "42 minutes ago",
	},
	{
		id: "2",
		userType: RECEIVER,
		message: "Hello",
		time: "42 minutes ago",
	},
	{
		id: "3",
		userType: SENDER,
		message: "How are you",
		time: "42 minutes ago",
	},
	{
		id: "4",
		userType: RECEIVER,
		message: "i am good",
		time: "42 minutes ago",
	},
	{
		id: "5",
		userType: RECEIVER,
		message: "and you",
		time: "42 minutes ago",
	},
	{
		id: "6",
		userType: SENDER,
		message: "i am also good",
		time: "42 minutes ago",
	},
	{
		id: "7",
		userType: RECEIVER,
		message: "fine",
		time: "42 minutes ago",
	},
	{
		id: "8",
		userType: RECEIVER,
		message: "let's play game together",
		time: "42 minutes ago",
	},
	{
		id: "11",
		userType: RECEIVER,
		message: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo eos corrupti
		eaque optio cupiditate sunt obcaecati cumque odit similique voluptate.
		Tempore ipsa atque aspernatur repudiandae quia, magni amet eum laboriosam.`,
		time: "1 hours ago",
	},
	{
		id: "9",
		userType: SENDER,
		message: "ok, let's be online",
		time: "1 hours ago",
	},
	{
		id: "10",
		userType: SENDER,
		message: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo eos corrupti
		eaque optio cupiditate sunt obcaecati cumque odit similique voluptate.
		Tempore ipsa atque aspernatur repudiandae quia, magni amet eum laboriosam.`,
		time: "50 minutes ago",
	},
	{
		id: "12",
		userType: SENDER,
		image: "/assets/images/jagdish_.jpg",
		time: "42 minutes ago",
	},
];
