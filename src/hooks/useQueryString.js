import * as React from 'react';
import { useHistory, useLocation } from 'react-router';
import { isNotEmpty } from '../utils';

export default function useQueryString() {
	let history = useHistory();
	let location = useLocation();
	let params = new URLSearchParams(location.search);

	const setParams = React.useCallback(
		(props) => {
			let params = new URLSearchParams(location.search);

			Object.keys(props).forEach((key) => {
				const value = props[key];

				if (isNotEmpty(value)) {
					params.set(key, value);
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
