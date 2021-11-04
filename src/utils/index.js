import * as React from 'react';
import { useHistory, useLocation } from 'react-router';

export function useClickOutside({ callback, enabled }) {
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
		if (enabled) {
			document.addEventListener('click', clickOutside);
		}

		return () => {
			document.removeEventListener('click', clickOutside);
		};
	}, [clickOutside, enabled]);

	return ref;
}

export function useQueryString() {
	let history = useHistory();
	let location = useLocation();
	let params = new URLSearchParams(location.search);

	const setParams = React.useCallback(
		(props) => {
			let params = new URLSearchParams(location.search);

			Object.keys(props).forEach((key) => {
				const value = props[key];

				if (isNotEmpty(value)) {
					params.set(key, value.toString());
				} else {
					params.delete(key);
				}
			});

			history.replace({ pathname: '/', search: params?.toString() });
		},
		[history, location.search]
	);

	return { params, setParams };
}

export function useGetLatest(obj) {
	let ref = React.useRef();
	ref.current = obj;

	return React.useCallback(() => ref.current, []);
}

export function _extends() {
	let _extends =
		Object.assign ||
		function (target) {
			for (let i = 1; i < arguments.length; i++) {
				let source = arguments[i];

				for (let key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}

			return target;
		};

	return _extends.apply(this, arguments);
}

export function isNotEmpty(value) {
	return value !== null && value !== '' && value !== undefined;
}
