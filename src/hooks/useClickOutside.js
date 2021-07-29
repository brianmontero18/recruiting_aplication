import * as React from 'react';

export default function useClickOutside({ callback }) {
	const ref = React.useRef();

	const clickOutside = React.useCallback(
		(e) => {
			if (!ref.current?.contains(e.target)) {
				callback();
			}
		},
		[callback]
	);

	React.useEffect(() => {
		document.addEventListener('click', clickOutside);

		return () => {
			document.removeEventListener('click', clickOutside);
		};
	}, [clickOutside]);

	return ref;
}
