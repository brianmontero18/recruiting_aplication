import * as React from 'react';

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

export function useGetLatest(obj) {
	let ref = React.useRef();
	ref.current = obj;

	return React.useCallback(() => ref.current, []);
}

export function isNotEmpty(value) {
	return value !== null && value !== '' && value !== undefined;
}
