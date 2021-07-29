import * as React from 'react';
import { useHistory, useLocation } from 'react-router';
import { isNotEmpty } from './utils';

const QueryStringContext = React.createContext();

export function useQueryStringContext() {
	const context = React.useContext(QueryStringContext);

	if (!context) {
		throw new Error(
			'useQueryStringContext must be used within QueryStringContext'
		);
	}
	return context;
}

export function QueryStringProvider({ children }) {
	let history = useHistory();
	let location = useLocation();
	let params = new URLSearchParams(location.search);
	const sortBy = params.get('sortBy');
	const name = params.get('name') || '';
	const status = params.get('status') || '';
	const position_applied = params.get('position_applied') || '';

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

	const data = React.useMemo(
		() => ({
			sortBy,
			name,
			status,
			position_applied,
			setParams,
		}),
		[name, position_applied, setParams, sortBy, status]
	);

	return (
		<QueryStringContext.Provider value={data}>
			{children}
		</QueryStringContext.Provider>
	);
}
