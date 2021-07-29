import * as React from 'react';
import { useQuery } from 'react-query';

const RESULT_WINNING_NUMBERS_KEY = 'filters-options-personio';
const initialData = { data: [{ position_applied: '', status: '' }] };

export default function useFilters(params) {
	const status = params.get('status') || '';
	const position_applied = params.get('position_applied') || '';

	return useQuery({
		queryKey: RESULT_WINNING_NUMBERS_KEY,
		queryFn,
		select: React.useCallback(
			(res) => {
				const filters = {
					status: status.split(','),
					position_applied: position_applied.split(','),
				};
				return getFilters(res, filters);
			},
			[position_applied, status]
		),
		initialData,
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

function getFilters(res, filters) {
	return res.data.reduce(
		(acc, cur) => {
			return {
				position_applied: {
					...acc.position_applied,
					[cur.position_applied]: filters.position_applied.includes(
						cur.position_applied
					),
				},
				status: {
					...acc.status,
					[cur.status]: filters.status.includes(cur.status),
				},
			};
		},
		{ position_applied: {}, status: {} }
	);
}
