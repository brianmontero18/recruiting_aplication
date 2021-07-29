import * as React from 'react';

export default function useSortBy(hooks) {
	hooks.getSortByToggleProps = [defaultGetSortByToggleProps];
	hooks.stateReducers.push(reducer);
	hooks.useInstance.push(useInstance);
}

function defaultGetSortByToggleProps(column) {
	return {
		onClick: column.canSort
			? (e) => {
					e.persist();
					column.toggleSortBy();
			  }
			: undefined,
		style: {
			cursor: column.canSort ? 'pointer' : undefined,
		},
		title: column.canSort ? 'Toggle SortBy' : undefined,
	};
}

function reducer(state, action, previousState, instance) {
	switch (action.type) {
		case 'init':
			return {
				sortBy: [],
				...state,
			};
		case 'setSortBy': {
			const { sortBy } = action;
			return {
				...state,
				sortBy,
			};
		}
		case 'toggleSortBy': {
			const { columnId, desc } = action;

			const {
				visibleColumns,
				maxMultiSortColCount = Number.MAX_SAFE_INTEGER,
			} = instance;

			const { sortBy } = state;

			// Find the column for this columnId
			const column = visibleColumns.find((d) => d.accessor === columnId);
			const { sortDescFirst } = column;

			// Find any existing sortBy for this column
			const existingSortBy = sortBy.find((d) => d.id === columnId);
			const existingIndex = sortBy.findIndex((d) => d.id === columnId);
			const hasDescDefined = typeof desc !== 'undefined' && desc !== null;

			let newSortBy = [];

			// What should we do with this sort action?
			let sortAction;

			if (existingIndex !== sortBy.length - 1 || sortBy.length !== 1) {
				sortAction = 'replace';
			} else if (existingSortBy) {
				sortAction = 'toggle';
			} else {
				sortAction = 'replace';
			}

			// Handle toggle states that will remove the sortBy
			if (
				sortAction === 'toggle' && // Must be toggling
				!hasDescDefined && // Must not be setting desc
				((existingSortBy && // Finally, detect if it should indeed be removed
					existingSortBy.desc &&
					!sortDescFirst) ||
					(!existingSortBy.desc && sortDescFirst))
			) {
				sortAction = 'remove';
			}

			if (sortAction === 'replace') {
				newSortBy = [
					{
						id: columnId,
						desc: hasDescDefined ? desc : sortDescFirst,
					},
				];
			} else if (sortAction === 'add') {
				newSortBy = [
					...sortBy,
					{
						id: columnId,
						desc: hasDescDefined ? desc : sortDescFirst,
					},
				];
				// Take latest n columns
				newSortBy.splice(0, newSortBy.length - maxMultiSortColCount);
			} else if (sortAction === 'toggle') {
				// This flips (or sets) the
				newSortBy = sortBy.map((d) => {
					if (d.id === columnId) {
						return {
							...d,
							desc: hasDescDefined ? desc : !existingSortBy.desc,
						};
					}
					return d;
				});
			} else if (sortAction === 'remove') {
				newSortBy = sortBy.filter((d) => d.id !== columnId);
			}

			return {
				...state,
				sortBy: newSortBy,
			};
		}
		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	}
}

function useInstance(instance) {
	const {
		rows,
		visibleColumns,
		state: { sortBy },
		dispatch,
	} = instance;

	const setSortBy = React.useCallback(
		(sortBy) => {
			dispatch({ type: 'setSortBy', sortBy });
		},
		[dispatch]
	);

	// Updates sorting based on a columnId and desc flag
	const toggleSortBy = React.useCallback(
		(columnId, desc) => {
			dispatch({ type: 'toggleSortBy', columnId, desc });
		},
		[dispatch]
	);

	// Add the getSortByToggleProps method to columns and headers
	visibleColumns.forEach((column) => {
		column.canSort = !column.disableSortBy;

		if (column.canSort) {
			column.toggleSortBy = (desc) => toggleSortBy(column.accessor, desc);
		}

		column.getSortByToggleProps = () => defaultGetSortByToggleProps(column);

		const columnSort = sortBy.find((d) => d.id === column.accessor);
		column.isSorted = Boolean(columnSort);
		column.sortedIndex = sortBy.findIndex((d) => d.id === column.accessor);
		column.isSortedDesc = column.isSorted ? columnSort.desc : undefined;
	});

	Object.assign(instance, {
		rows,
		setSortBy,
		toggleSortBy,
	});
}
