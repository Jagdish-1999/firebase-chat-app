import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFile = async (file: File, onComplete?: () => void) => {
	const timestamp = new Date();
	const storageRef = ref(storage, `images/${timestamp}${file.name}`);

	const uploadTask = uploadBytesResumable(storageRef, file);

	return new Promise((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log("Upload is " + progress + "% done");
				// switch (snapshot.state) {
				// 	case "paused":
				// 		console.log("Upload is paused");
				// 		break;
				// 	case "running":
				// 		console.log("Upload is running");
				// 		break;
				// }
			},
			(error) => {
				console.error("Error in uploadFile: ", error);
				reject(error.message || "Something went wrong");
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					resolve(downloadURL);
					onComplete && onComplete();
				});
			}
		);
	});
};
