import * as React from 'react';

export default function useClickOutside() {
	const ref = React.useRef();
	const [open, setOpen] = React.useState(false);

	const clickOutside = React.useCallback((e) => {
		if (!ref.current?.contains(e.target)) {
			setOpen(false);
		}
	}, []);

	React.useEffect(() => {
		document.addEventListener('click', clickOutside);

		return () => {
			document.removeEventListener('click', clickOutside);
		};
	}, [clickOutside]);

	return { ref, open, setOpen };
}
