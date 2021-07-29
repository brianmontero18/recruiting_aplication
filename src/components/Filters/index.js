import * as React from 'react';
import useFilters from '../../hooks/useFilters';
import useClickOutside from '../../hooks/useClickOutside';

export default function Filters({ params, setParams }) {
	const {
		data: { position_applied, status },
	} = useFilters(params);

	return (
		<section className="persionio-filters">
			<span>Filter List</span>
			<input
				name="name"
				className="persionio-input"
				type="text"
				placeholder="Search name"
				value={params.get('name') || ''}
				onChange={(e) => setParams({ name: e.target.value })}
			/>
			<FilterBox
				name="status"
				label="Status"
				options={status}
				setParams={setParams}
			/>
			<FilterBox
				name="position_applied"
				label="Position Applied"
				options={position_applied}
				setParams={setParams}
			/>
			<button
				onClick={() =>
					setParams({ name: '', status: '', position_applied: '' })
				}
			>
				Clear Filters
			</button>
		</section>
	);
}

function FilterBox({ name, options, setParams, label }) {
	const { ref, open, setOpen } = useClickOutside();
	const [search, setSearch] = React.useState('');

	const handleChangeOption = React.useCallback(
		(value) => {
			setParams({
				[name]: Object.keys(options).filter((elem) =>
					value.hasOwnProperty(elem) ? value[elem] : options[elem]
				),
			});
		},
		[name, options, setParams]
	);

	return (
		<div className="personio-filters-box-container" ref={ref}>
			<button onClick={() => setOpen((prevState) => !prevState)}>
				{label}
			</button>
			{open ? (
				<div className="persionio-filters-dropdown-container">
					<input
						className="persionio-input"
						placeholder="Search"
						onChange={(e) => setSearch(e.target.value)}
					/>
					<br />
					{Object.keys(options).map((element, index) =>
						element.toUpperCase().indexOf(search.toUpperCase()) !==
						-1 ? (
							<div key={index}>
								<input
									type="checkbox"
									defaultChecked={options[element]}
									onChange={(e) =>
										handleChangeOption({
											[element]: e.target.checked,
										})
									}
								/>
								<span>{element}</span>
							</div>
						) : null
					)}
				</div>
			) : null}
		</div>
	);
}
