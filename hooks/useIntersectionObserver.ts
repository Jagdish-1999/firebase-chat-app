import { useState, useEffect, useRef, LegacyRef } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {}
type UserIntersectionObserverReturnType<T extends Element> = [
	LegacyRef<T | null>,
	IntersectionObserverEntry | null
];

const useIntersectionObserver = <T extends Element>(
	options: UseIntersectionObserverOptions
): UserIntersectionObserverReturnType<T> => {
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
	const observer = useRef<IntersectionObserver | null>(null);
	const elementRef = useRef<T | null>(null);

	useEffect(() => {
		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver(
			([entry]) => setEntry(entry),
			options
		);

		const { current: currentElement } = elementRef;
		if (currentElement) observer.current.observe(currentElement);

		return () => {
			if (observer.current) observer.current.disconnect();
		};
	}, [options]);

	return [elementRef, entry];
};

export default useIntersectionObserver;
