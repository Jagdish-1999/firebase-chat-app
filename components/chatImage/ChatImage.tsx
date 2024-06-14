import React from "react";
import Image from "next/image";
import styles from "./chatImage.module.scss";

interface PropTypes {
	imgUrl: string;
	onClick(imgUrl: string): void;
}

const ChatImage: React.FC<PropTypes> = ({ imgUrl, onClick }) => {
	return (
		<div className={styles.container} onClick={() => onClick(imgUrl)}>
			<Image
				alt="img"
				src={imgUrl || ""}
				width={500}
				height={500}
				sizes={`sizes="(max-width: 380px) 100vw, 380px"`}
				className={styles.image}
				loading="eager"
				priority
			/>
		</div>
	);
};

export default ChatImage;
