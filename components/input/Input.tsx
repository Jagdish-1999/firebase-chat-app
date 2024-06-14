import React, { useCallback } from "react";
import styles from "./input.module.scss";
import Avatar from "../avatar/Avatar";
import Image from "next/image";

interface InputPropTypes<T> {
	type?: string;
	title: string;
	name: string;
	fileIcon?: string;
	value?: T;
	handleEnterPress?(evt: React.KeyboardEvent<HTMLDivElement>): void;
	handleInput(evt: React.ChangeEvent<HTMLInputElement>): void;
}

const Input = <T extends Record<string, any>>({
	type = "text",
	title,
	name,
	value,
	fileIcon,
	handleInput,
	handleEnterPress,
}: InputPropTypes<T>) => {
	const handleChange = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			evt.stopPropagation();
			evt.preventDefault();
			handleInput(evt);
		},
		[handleInput]
	);

	return (
		<div
			className={`${styles.container} ${
				type === "file" ? styles.transparentBg : ""
			}`}
			onKeyDown={(evt) =>
				evt.key === "Enter" && handleEnterPress && handleEnterPress(evt)
			}>
			{type === "search" && (
				<div className={styles.searchInputContainer}>
					<Image
						src="/assets/search.png"
						alt="search"
						width={20}
						height={20}
						loading="eager"
						priority
					/>
					<input
						autoFocus
						placeholder="Search"
						className={styles.searchInput}
						onChange={handleInput}
					/>
				</div>
			)}
			{type === "file" && (
				<div className={styles.avatarLogo}>
					<label htmlFor={name} className={styles.avatarLabel}>
						<Avatar
							src={value?.url ? value.url : fileIcon || "/assets/avatar.png"}
							width={40}
							height={40}
						/>
					</label>
					<input
						id={name}
						type={type}
						className={styles.input}
						name={name}
						onChange={handleChange}
					/>
					{title && <label htmlFor={name}>{title}</label>}
				</div>
			)}
			{type !== "file" && type !== "search" && (
				<>
					<input
						id={name}
						type={type}
						name={name}
						value={typeof value === "string" ? value : value?.[name] ?? ""}
						className={styles.input}
						onChange={handleChange}
					/>
					<label
						htmlFor={name}
						className={!!value?.[name] ? styles.notPlaceholderShown : ""}>
						{title}
					</label>
				</>
			)}
		</div>
	);
};

export default Input;
