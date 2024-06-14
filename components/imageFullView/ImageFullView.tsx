import React from "react";
import styles from "./imageFullView.module.scss";
import Image from "next/image";
import { ChatTypes } from "@/constants/constants";

interface PropTypes {
	chatImage: string | undefined;
	setFullImageView(chatImage: string): void;
}

export const ImageFullView: React.FC<PropTypes> = ({
	chatImage = "",
	setFullImageView,
}) => {
	return (
		<div className={styles.container} onClick={() => setFullImageView("")}>
			<div className={styles.imageContainer}>
				<Image
					src={chatImage}
					alt="img"
					layout="fill"
					className={styles.image}
					loading="lazy"
				/>
			</div>
		</div>
	);
};
