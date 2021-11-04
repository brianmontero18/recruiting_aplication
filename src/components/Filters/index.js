import * as React from 'react';
import Input from '../Input';
import DropdownInput from '../DropdownInput';
import { useClickOutside, useQueryString } from '../../utils';
import { useCandidates, getFilters } from '../../api';
import './index.css';

export default function Filters() {
	const { data } = useCandidates({ select: getFilters });
	const { params, setParams } = useQueryString();
	const handleFilterChange = React.useCallback(
		(e, name, options) => {
			setParams({
				[name]: Object.keys(options).filter((elem) =>
					e.target.name === elem ? e.target.checked : options[elem]
				),
			});
		},
		[setParams]
	);

	return (
		<section className="personio-filters">
			<span>Applications</span>
			<Input
				name="name"
				type="text"
				placeholder="Search name"
				value={params.get('name') || ''}
				onChange={(e) => setParams({ name: e.target.value })}
			/>
			<FilterButton label="Status">
				<DropdownInput
					name="status"
					options={data?.status}
					handleChange={handleFilterChange}
				/>
			</FilterButton>
			<FilterButton label="Position Applied">
				<DropdownInput
					name="position_applied"
					options={data?.position_applied}
					handleChange={handleFilterChange}
				/>
			</FilterButton>
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

function FilterButton({ label, children }) {
	const [open, setOpen] = React.useState(false);
	const ref = useClickOutside({
		callback: React.useCallback(() => setOpen(false), []),
		enabled: open,
	});

	return (
		<div className="personio-filters-box-container">
			<button
				className="personio-filters-box-button"
				onClick={() => setOpen((prevState) => !prevState)}
			>
				{label}
			</button>
			{open ? (
				<div className="personio-filters-dropdown-container" ref={ref}>
					{children}
				</div>
			) : null}
		</div>
	);
}
