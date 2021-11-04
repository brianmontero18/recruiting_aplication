import * as React from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import orderBy from 'lodash.orderby';
import { isNotEmpty } from '../utils';

const CANDIDATES_PERSONIO_KEY = 'candidates-personio';
const CANDIDATES_PERSONIO_URL =
	'http://personio-fe-test.herokuapp.com/api/v1/candidates';

export function useCandidates({ select }) {
	let location = useLocation();

	return useQuery({
		queryKey: CANDIDATES_PERSONIO_KEY,
		queryFn,
		select: React.useCallback(
			(res) => select(res, location),
			[select, location]
		),
	});
}

async function queryFn() {
	const resp = await fetch(CANDIDATES_PERSONIO_URL);
	const data = await resp.json();

	if (!data.error) {
		return data;
	} else {
		throw new Error(data.error?.message);
	}
}

export function getCandidates(res, location) {
	let params = new URLSearchParams(location.search);

	const sortBy = params.get('sortBy');
	const name = params.get('name') || '';
	const status = params.get('status') || '';
	const position_applied = params.get('position_applied') || '';
	const filters = {
		...(isNotEmpty(name) ? { name: name.split(',') } : {}),
		...(isNotEmpty(status) ? { status: status.split(',') } : {}),
		...(isNotEmpty(position_applied)
			? { position_applied: position_applied.split(',') }
			: {}),
	};

	let data = res.data;
	const filterNames = Object.keys(filters);

	if (filterNames.length) {
		let filteredData = [];

		for (let index = 0; index < res.data.length; index++) {
			const candidate = res.data[index];

			if (
				filterNames.every((f) =>
					filters[f].some((elem) => {
						return (
							candidate[f]
								.toUpperCase()
								.indexOf(elem.toUpperCase()) !== -1
						);
					})
				)
			) {
				filteredData.push(candidate);
			}
		}

		data = filteredData;
	}
	if (sortBy && data) {
		if (sortBy?.startsWith('-')) {
			return orderBy(data, [sortBy.split('-')[1]], ['desc']);
		} else {
			return orderBy(data, sortBy);
		}
	}

	return data;
}

export function getFilters(res, location) {
	let params = new URLSearchParams(location.search);
	const status = params.get('status') || '';
	const position_applied = params.get('position_applied') || '';

	const filters = {
		status: status.split(','),
		position_applied: position_applied.split(','),
	};

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
