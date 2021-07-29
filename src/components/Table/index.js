import * as React from 'react';
import useTable from '../../hooks/useTable';
import useSortBy from '../../hooks/useSortBy';
import { ReactComponent as SortAscIcon } from '../../assets/sort_asc.svg';
import { ReactComponent as SortDescIcon } from '../../assets/sort_desc.svg';
import './index.css';

const defaultData = [];

export default function Table({
	data = defaultData,
	columns,
	isFetching,
	initialState,
	onChangeSort,
}) {
	const { visibleColumns, rows, prepareRow, state } = useTable(
		{
			data,
			columns,
			initialState,
		},
		useSortBy
	);

	React.useEffect(() => {
		onChangeSort(state.sortBy);
	}, [onChangeSort, state.sortBy]);

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
					{!isFetching
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
					{isFetching ? (
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
