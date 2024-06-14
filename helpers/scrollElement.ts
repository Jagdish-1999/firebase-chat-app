export const scrollElement = (id: string) => {
	const scrollContainer = document.getElementById(id) as HTMLElement;
	scrollContainer.addEventListener("DOMContentLoaded", function () {
		scrollContainer.scrollTop = scrollContainer.offsetHeight;

		console.log(scrollContainer.offsetHeight);
		// scrollContainer.scrollTop = scrollContainer.scrollHeight;
		// scrollContainer.scrollTo(0, scrollContainer.offsetHeight);
	});
};
