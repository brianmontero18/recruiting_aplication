import * as React from 'react';
import Filters from './components/Filters';
import Table from './components/Table';
import useCandidates from './hooks/useCandidates';
import useQueryString from './hooks/useQueryString';
import './App.css';

export default function App() {
	const { params, setParams } = useQueryString();
	const { data, isFetching } = useCandidates(params);
	const initialSortBy = params.get('sortBy');

	const initialTableState = React.useMemo(() => {
		if (initialSortBy) {
			if (initialSortBy.startsWith('-')) {
				return {
					sortBy: [{ id: initialSortBy.slice(1), desc: true }],
				};
			} else {
				return { sortBy: [{ id: initialSortBy, desc: false }] };
			}
		} else {
			return {};
		}
	}, [initialSortBy]);

	const onChangeSort = React.useCallback(
		(sortBy) => {
			if (sortBy[0]) {
				const { id, desc } = sortBy[0];

				setParams({
					sortBy: sortBy.length ? `${desc ? '-' : ''}${id}` : '',
				});
			}
		},
		[setParams]
	);

	return (
		<>
			<header className="personio-header-container"></header>
			<main className="personio-main-container">
				<section className="personio-details-container">
					<Filters params={params} setParams={setParams} />
					<Table
						data={data}
						columns={columns}
						isFetching={!data && isFetching}
						onChangeSort={onChangeSort}
						initialState={initialTableState}
					/>
				</section>
			</main>
		</>
	);
}

const columns = [
	{ Header: 'Name', accessor: 'name', disableSortBy: true },
	{ Header: 'Email', accessor: 'email', disableSortBy: true },
	{ Header: 'Age', accessor: 'birth_date', disableSortBy: true },
	{
		Header: 'Years of Experience',
		accessor: 'year_of_experience',
	},
	{ Header: 'Position applied', accessor: 'position_applied' },
	{ Header: 'Applied', accessor: 'application_date' },
	{ Header: 'Status', accessor: 'status', disableSortBy: true },
];
