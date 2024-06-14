import React from "react";
import styles from "./button.module.scss";

interface ButtonPropTypes {
	label: string;
	onClick?(evt: React.MouseEvent<HTMLButtonElement>): Promise<void>;
	disabled?: boolean;
}

export const Button: React.FC<ButtonPropTypes> = ({
	label,
	onClick,
	disabled,
}) => {
	return (
		<button
			className={styles.addUserButton}
			onClick={onClick}
			disabled={disabled}>
			{label}
		</button>
	);
};
