import * as React from 'react';
import { useFilters } from '../../api/candidates';
import useClickOutside from '../../hooks/useClickOutside';
import { useQueryStringContext } from '../../queryStringContext';
import './index.css';

export default function Filters() {
	const { name, setParams } = useQueryStringContext();
	const { data } = useFilters();

	return (
		<section className="personio-filters">
			<span>Applications</span>
			<input
				name="name"
				className="personio-input"
				type="text"
				placeholder="Search name"
				value={name}
				onChange={(e) => setParams({ name: e.target.value })}
			/>
			<FilterBox name="status" label="Status" options={data?.status} />
			<FilterBox
				name="position_applied"
				label="Position Applied"
				options={data?.position_applied}
			/>
			<button
				className="personio-clear-filter-button"
				onClick={() =>
					setParams({ name: '', status: '', position_applied: '' })
				}
			>
				Clear Filters
			</button>
		</section>
	);
}

function FilterBox({ name, label, options }) {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="personio-filters-box-container">
			<button
				className="personio-filters-box-button"
				onClick={() => setOpen((prevState) => !prevState)}
			>
				{label}
			</button>
			{open ? (
				<FilterBoxDropdown
					name={name}
					options={options}
					setOpen={setOpen}
				/>
			) : null}
		</div>
	);
}

function FilterBoxDropdown({ name, options = '', setOpen }) {
	const [search, setSearch] = React.useState('');
	const ref = useClickOutside({
		callback: React.useCallback(() => setOpen(false), [setOpen]),
	});
	const { setParams } = useQueryStringContext();

	React.useEffect(() => () => setSearch(''), []);

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
		<div className="personio-filters-dropdown-container" ref={ref}>
			<input
				className="personio-input"
				placeholder="Search"
				onChange={(e) => setSearch(e.target.value)}
			/>
			<br />
			<div className="personio-filters-dropdown-list">
				{Object.keys(options).map((element, index) =>
					element.toUpperCase().indexOf(search.toUpperCase()) !==
					-1 ? (
						<React.Fragment key={index}>
							<input
								type="checkbox"
								defaultChecked={options[element]}
								onChange={(e) =>
									handleChangeOption({
										[element]: e.target.checked,
									})
								}
							/>
							<span style={{ marginLeft: '10px' }}>
								{element}
							</span>
							<br />
						</React.Fragment>
					) : null
				)}
			</div>
		</div>
	);
}
