import React from "react";
import Image from "next/image";
import styles from "./avatar.module.scss";

export interface PropTypes {
	src: string;
	width?: number;
	height?: number;
	onClick?: () => void;
}

const Avatar: React.FC<PropTypes> = ({ src, width, height, onClick }) => {
	return (
		<>
			<Image
				className={styles.image}
				data-src={src}
				src={src || "/assets/images/pixel.png"}
				alt="profile"
				width={width ?? 500}
				height={height ?? 500}
				onClick={onClick}
				loading="eager"
				priority
			/>
		</>
	);
};

export default Avatar;
