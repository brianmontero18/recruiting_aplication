export default function Filters({ params, setParams }) {
	const handleChangeFilters = (e) =>
		setParams({ [e.target.name]: e.target.value });

	return (
		<section className="persionio-filters">
			<input
				name="name"
				className="persionio-input"
				type="text"
				placeholder="Search name"
				defaultValue={params.get('name')}
				onChange={handleChangeFilters}
			/>
			<input
				name="status"
				className="persionio-input"
				type="text"
				placeholder="Search status"
				defaultValue={params.get('status')}
				onChange={handleChangeFilters}
			/>
			<input
				name="position_applied"
				className="persionio-input"
				type="text"
				placeholder="Search Position applied"
				defaultValue={params.get('position_applied')}
				onChange={handleChangeFilters}
			/>
		</section>
	);
}
