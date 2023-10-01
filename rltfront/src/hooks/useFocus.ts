import { MutableRefObject, useState, useEffect } from 'react';

export const useFocus = (ref: MutableRefObject<HTMLElement | null>) => {
	const [inFocus, setInFocus] = useState(false);
	const [canRender, setCanRender] = useState(false);

	useEffect(() => {
		setCanRender(typeof window !== 'undefined');
	}, []);

	useEffect(() => {
		if (ref.current && typeof window !== 'undefined') {
			window.addEventListener('click', ({ target }) => {
				if (!ref.current) {
					setInFocus(false);

					return;
				}

				if (!target) {
					setInFocus(false);

					return;
				}

				// @ts-ignore
				setInFocus(target === ref.current || ref.current.contains(target));
			});
		}
	}, [ref, canRender]);

	return {
		inFocus,
		canRender,
	};
};
