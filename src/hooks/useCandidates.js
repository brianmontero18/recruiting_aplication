import { useCallback } from 'react';
import { useQuery } from 'react-query';
import orderBy from 'lodash.orderby';
import { isNotEmpty } from '../utils';

const RESULT_WINNING_NUMBERS_KEY = 'candidates-personio';

export default function useCandidates(params) {
	const sortBy = params.get('sortBy');
	const name = params.get('name');
	const status = params.get('status');
	const position_applied = params.get('position_applied');

	return useQuery({
		queryKey: RESULT_WINNING_NUMBERS_KEY,
		queryFn,
		select: useCallback(
			(res) => {
				const filters = {
					...(isNotEmpty(name) ? { name } : {}),
					...(isNotEmpty(status) ? { status } : {}),
					...(isNotEmpty(position_applied)
						? { position_applied }
						: {}),
				};
				return getCandidates(res, sortBy, filters);
			},
			[sortBy, name, status, position_applied]
		),
		retry: (failureCount) => failureCount < 3,
		onError: (err) => console.log(err),
		notifyOnChangeProps: 'tracked',
	});
}

async function queryFn() {
	return fetch(
		'http://personio-fe-test.herokuapp.com/api/v1/candidates'
	).then(async (res) => {
		const data = await res.json();

		if (!data.error) {
			return data;
		} else {
			throw new Error(data.error?.message);
		}
	});
}

function getCandidates(res, sortByValue, filters) {
	let data = res.data;
	const filterNames = Object.keys(filters);

	if (filterNames.length) {
		let filteredData = [];

		for (let index = 0; index < res.data.length; index++) {
			const candidate = res.data[index];

			if (
				filterNames.every(
					(f) =>
						candidate[f]
							.toUpperCase()
							.indexOf(filters[f].toUpperCase()) !== -1
				)
			) {
				filteredData.push(candidate);
			}
		}

		data = filteredData;
	}
	if (sortByValue && data) {
		if (sortByValue?.startsWith('-')) {
			return orderBy(data, [sortByValue.split('-')[1]], ['desc']);
		} else {
			return orderBy(data, sortByValue);
		}
	}

	return data;
}
