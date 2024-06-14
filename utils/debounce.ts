// export const debounce = <F extends (...args: any[]) => void>(
// 	func: F,
// 	delay: number
// ) => {
// 	let timeoutId: NodeJS.Timeout;

// 	return (...args: Parameters<F>) => {
// 		clearTimeout(timeoutId);
// 		timeoutId = setTimeout(() => {
// 			console.log("object");
// 			func(...args);
// 		}, delay);
// 	};
// };

export const debounce = <F extends (...args: any[]) => void>(
	func: F,
	delay: number
) => {
	let timeoutId: NodeJS.Timeout;
	let called = false;

	return (...args: Parameters<F>) => {
		if (!called) {
			called = true;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				called = false;
				func(...args);
			}, delay);
		}
	};
};
