import * as React from 'react';
import { useQuery } from 'react-query';
import orderBy from 'lodash.orderby';
import { useQueryStringContext } from '../queryStringContext';
import { isNotEmpty } from '../utils';

const CANDIDATES_PERSONIO_KEY = 'candidates-personio';
const defaultConfig = {
	retry: (failureCount) => failureCount < 3,
	onError: (err) => console.log(err),
	notifyOnChangeProps: 'tracked',
};

export function useCandidates() {
	const { sortBy, name, status, position_applied } = useQueryStringContext();

	return useQuery({
		...defaultConfig,
		queryKey: CANDIDATES_PERSONIO_KEY,
		queryFn,
		select: React.useCallback(
			(res) => {
				const filters = {
					...(isNotEmpty(name) ? { name: name.split(',') } : {}),
					...(isNotEmpty(status)
						? { status: status.split(',') }
						: {}),
					...(isNotEmpty(position_applied)
						? { position_applied: position_applied.split(',') }
						: {}),
				};
				return getCandidates(res, sortBy, filters);
			},
			[sortBy, name, status, position_applied]
		),
	});
}

export function useFilters() {
	const { status, position_applied } = useQueryStringContext();

	return useQuery({
		...defaultConfig,
		queryKey: CANDIDATES_PERSONIO_KEY,
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
				filterNames.every((f) =>
					filters[f].some((elem) => {
						return (
							elem
								.toUpperCase()
								.indexOf(candidate[f].toUpperCase()) !== -1
						);
					})
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
