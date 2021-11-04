import * as React from 'react';
import columns from './columns';
import useTable from './useTable';
import useSortBy from './useSortBy';
import { useCandidates, getCandidates } from '../../api';
import { useQueryString } from '../../utils';
import { ReactComponent as SortAscIcon } from '../../assets/sort_asc.svg';
import { ReactComponent as SortDescIcon } from '../../assets/sort_desc.svg';
import './index.css';

const defaultData = [];

export default function Table() {
	const { data, isFetching } = useCandidates({ select: getCandidates });
	const { params, setParams } = useQueryString();
	const initialSortBy = params.get('sortBy');

	const { visibleColumns, rows, prepareRow, state } = useTable(
		{
			data: data || defaultData,
			columns,
			initialState: React.useMemo(() => {
				if (initialSortBy) {
					if (initialSortBy.startsWith('-')) {
						return {
							sortBy: [
								{ id: initialSortBy.slice(1), desc: true },
							],
						};
					}
					return { sortBy: [{ id: initialSortBy, desc: false }] };
				}
				return {};
			}, [initialSortBy]),
		},
		useSortBy
	);

	React.useEffect(() => {
		if (state.sortBy[0]) {
			const { id, desc } = state.sortBy[0];

			setParams({
				sortBy: state.sortBy.length ? `${desc ? '-' : ''}${id}` : '',
			});
		}
	}, [setParams, state.sortBy]);

	return (
		<div className="personio-table-container">
			<table role="table">
				<thead>
					<tr key="header_group_column">
						{visibleColumns.map((column, columnIndex) => (
							<th
								{...column.getSortByToggleProps()}
								key={`header_column_${columnIndex}`}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<span>{column.Header}</span>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
										}}
									>
										{column.canSort ? (
											<>
												<SortAscIcon
													fillOpacity={
														column.isSorted &&
														!column.isSortedDesc
															? 1
															: 0.4
													}
													style={{
														marginBottom: '5px',
													}}
												/>
												<SortDescIcon
													fillOpacity={
														column.isSorted &&
														column.isSortedDesc
															? 1
															: 0.4
													}
												/>
											</>
										) : null}
									</div>
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{!(!data && isFetching)
						? rows?.map((row, rowIndex) => {
								prepareRow(row);

								return (
									<tr key={`body_row_${rowIndex}`}>
										{row.cells.map((cell, cellIndex) => (
											<td key={`body_cell_${cellIndex}`}>
												{cell}
											</td>
										))}
									</tr>
								);
						  })
						: null}
					{!data && isFetching ? (
						/** LOADING SKELETON **/
						<>
							{[...Array(10).keys()].map((_, rowIndex) => (
								<tr key={`loading_body_row_${rowIndex}`}>
									{visibleColumns.map((cell, cellIndex) => (
										<td
											key={`loading_body_cell_${cellIndex}`}
										>
											<div className="personio-skeleton-line"></div>
										</td>
									))}
								</tr>
							))}
						</>
					) : null}
				</tbody>
			</table>
		</div>
	);
}
