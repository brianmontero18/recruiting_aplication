import * as React from 'react';
import { useGetLatest, _extends } from '../../utils';

export default function useTable(props, ...plugins) {
	let instanceRef = React.useRef({}); // Create a getter for the instance (helps avoid a lot of potential memory leaks)
	let getInstance = useGetLatest(instanceRef.current); // Assign the props, plugins and hooks to the instance

	// Assign the props, plugins and hooks to the instance
	Object.assign(getInstance(), {
		...props,
		stateReducer: defaultStateReducer,
		plugins,
		hooks: {
			stateReducers: [],
			columns: [],
			allColumns: [],
			useInstance: [],
			prepareRow: [],
		},
	});

	// Allow plugins to register hooks as early as possible
	plugins.filter(Boolean).forEach((plugin) => {
		plugin(getInstance().hooks);
	});

	// Consume all hooks and make a getter for them
	const getHooks = useGetLatest(getInstance().hooks);
	getInstance().getHooks = getHooks;
	delete getInstance().hooks;

	const { initialState, data, columns, stateReducer } = getInstance();

	// Setup user reducer ref
	const getStateReducer = useGetLatest(stateReducer);

	// Build the reducer
	const reducer = React.useCallback(
		(state, action) => {
			return [
				...getHooks().stateReducers,
				// Allow the user to add their own state reducer(s)
				...[getStateReducer()],
			].reduce(
				(s, handler) => handler(s, action, state, getInstance()) || s,
				state
			);
		},
		[getHooks, getStateReducer, getInstance]
	);

	// Start the reducer
	const [reducerState, dispatch] = React.useReducer(reducer, undefined, () =>
		reducer(initialState, { type: 'init' })
	);

	// Allow the user to control the final state with hooks
	const state = reduceHooks([], reducerState, { instance: getInstance() });

	Object.assign(getInstance(), {
		state,
		dispatch,
	});

	let rows = [];
	let rowsById = {};
	let allColumnsQueue = columns.map((a) => a.accessor);

	while (allColumnsQueue.length) {
		let column = allColumnsQueue.shift();

		accessRowsForColumn({
			data,
			column,
			rows,
			rowsById,
		});
	}

	Object.assign(getInstance(), { rows });

	getInstance().visibleColumns = React.useMemo(
		() => columns.map((d) => decorateColumn(d, defaultColumn)),
		[columns]
	);

	getInstance().prepareRow = React.useCallback(
		(row) => {
			row.cells = getInstance().visibleColumns.map((column) => {
				const value = row.originalRow[column.accessor];

				if (typeof column.Cell === 'function') {
					return React.createElement(column.Cell, {
						value,
					});
				} else {
					return value;
				}
			});
		},
		[getInstance]
	);

	loopHooks(getHooks().useInstance, getInstance());

	return getInstance();
}

function accessRowsForColumn(_ref) {
	let data = _ref.data,
		rows = _ref.rows,
		rowsById = _ref.rowsById;

	function accessRow(originalRow, rowIndex, parentRows) {
		let id = originalRow.id;
		let row = rowsById[id]; // If the row hasn't been created, let's make it

		if (!row) {
			let row = {
				id: id,
				index: rowIndex,
				originalRow: originalRow,
				cells: [{}], // This is a dummy cell
			};
			parentRows.push(row); // Keep track of every row in a flat array
			rowsById[id] = row;
		}
	}

	data.forEach((originalRow, rowIndex) =>
		accessRow(originalRow, rowIndex, rows)
	);
}

function decorateColumn(column, userDefaultColumn) {
	Object.assign(
		column,
		_extends(
			{ Header: null, Footer: null },
			defaultColumn,
			userDefaultColumn,
			column
		)
	);
	Object.assign(column, { width: column.width });

	return column;
} // Build the header groups from the bottom up

const defaultStateReducer = (state, action, prevState) => state;

const defaultColumn = {
	Cell: null,
	width: 150,
	minWidth: 0,
	maxWidth: Number.MAX_SAFE_INTEGER,
	sortDescFirst: false,
};

const reduceHooks = (hooks, initial, meta = {}) =>
	hooks.reduce((prev, next) => {
		const nextValue = next(prev, meta);

		return nextValue;
	}, initial);

const loopHooks = (hooks, context, meta = {}) =>
	hooks.forEach((hook) => {
		hook(context, meta);
	});
