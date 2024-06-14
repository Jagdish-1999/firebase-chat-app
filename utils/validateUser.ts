export interface FormTypes {
	username?: string;
	email: string;
	password: string;
}
export const validateUer = (requestedUser: FormTypes) => {
	const userList = [
		{ email: "jagdishchandra1368@gmail.com", password: "1234" },
	];
	localStorage.setItem("user", JSON.stringify(requestedUser));

	return userList.some(
		(user: FormTypes) =>
			requestedUser.email &&
			requestedUser.password &&
			user.email === requestedUser.email &&
			user.password === requestedUser.password
	);
};
