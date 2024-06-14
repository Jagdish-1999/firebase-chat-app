import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/userStore";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

import styles from "./register.module.scss";
import Input from "../input/Input";
import { FormTypes } from "@/utils/validateUser";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { uploadFile } from "@/lib/uploadFile";

const LOGIN = "Login";
const REGISTER = "Register";
const loginText = "Already have an account?";
const registerText = "Don't have an account?";

export const emptyFormValues = {
	username: "",
	email: "",
	password: "",
};

export interface AvatarType {
	file: File;
	url: string;
}

interface RegiserPropTypes {}

const Register: React.FC<RegiserPropTypes> = () => {
	const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
	const [formValues, setFormValues] = useState<FormTypes>(emptyFormValues);
	const [avatarLogo, setAvatarLogo] = useState<AvatarType>({} as AvatarType);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleReginserUser = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await createUserWithEmailAndPassword(
				auth,
				formValues.email,
				formValues.password
			);

			const imageUrl = await uploadFile(avatarLogo.file);

			await setDoc(doc(db, "users", response.user.uid), {
				id: response.user.uid,
				username: formValues.username,
				email: formValues.email,
				avatar: imageUrl,
				blockedUsers: [],
			});
			await setDoc(doc(db, "userchats", response.user.uid), {
				chats: [],
			});

			toast.success("Account created! You can login now!");
			setFormValues(emptyFormValues);
			setAvatarLogo({} as AvatarType);
			setIsLoginMode(true);
		} catch (error: any) {
			if ((error?.message as string).includes("already")) {
				toast.error("User already exist ");
			} else toast.error("User Registration failed");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [
		avatarLogo.file,
		formValues.email,
		formValues.password,
		formValues.username,
	]);

	const handleLoginUser = useCallback(async () => {
		setIsLoading(true);
		try {
			await signInWithEmailAndPassword(
				auth,
				formValues.email,
				formValues.password
			);
			toast.success("User logged in success");
			router.push("/chats");
			setFormValues(emptyFormValues);
		} catch (error: any) {
			if ((error.message as string).includes("invalid")) {
				toast.error("Invalid user");
			} else {
				toast.error("Login failed");
			}
			console.error("Error Login User: ", error);
		} finally {
			setIsLoading(false);
		}
	}, [formValues.email, formValues.password, router]);

	const handleSubmit = useCallback(
		async (evt: React.MouseEvent<HTMLButtonElement>) => {
			evt.preventDefault();
			if (!isLoginMode && formValues.email && formValues.password) {
				handleReginserUser();
			} else {
				handleLoginUser();
			}
		},
		[
			formValues.email,
			formValues.password,
			handleLoginUser,
			handleReginserUser,
			isLoginMode,
		]
	);

	const handleInput = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			setFormValues((prev: FormTypes) => ({
				...prev,
				[evt.target.name]: evt.target.value,
			}));
		},
		[]
	);

	const handleAvatarUpload = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			if (evt.target.files?.[0]) {
				const file = evt.target.files[0];
				setAvatarLogo({
					file,
					url: URL.createObjectURL(file),
				});
			}
		},
		[]
	);

	return (
		<div className={styles.container}>
			<form className={styles.form}>
				<div className={styles.inputContainer}>
					<h1>{isLoginMode ? LOGIN : REGISTER}</h1>
					{!isLoginMode && (
						<div className={styles.userName}>
							<Input<FormTypes>
								title="User name"
								name="username"
								value={formValues}
								handleInput={handleInput}
							/>
						</div>
					)}
					<div className={styles.email}>
						<Input<FormTypes>
							title="Email"
							name="email"
							value={formValues}
							handleInput={handleInput}
						/>
					</div>
					<div className={styles.password}>
						<Input<FormTypes>
							title="Password"
							type="password"
							name="password"
							value={formValues}
							handleInput={handleInput}
						/>
					</div>
					{!isLoginMode && (
						<Input<{ file: File; url: string }>
							type="file"
							title="Upload Avatar"
							name="avatar"
							value={avatarLogo as AvatarType}
							handleInput={handleAvatarUpload}
						/>
					)}
					<button
						className={styles.button}
						onClick={handleSubmit}
						disabled={isLoading}>
						{!isLoading ? (isLoginMode ? LOGIN : REGISTER) : "Loading..."}
					</button>
					{/* {isLoginMode && (
						<Link href="/login" className={styles.googleLogin}>
							Signin With Google
						</Link>
					)} */}
					<div>
						<h4 className={styles.text}>
							{isLoginMode ? registerText : loginText}
						</h4>
						<h4
							className={styles.login}
							onClick={() => setIsLoginMode((prev) => !prev)}>
							{isLoginMode ? REGISTER : LOGIN}
						</h4>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Register;
