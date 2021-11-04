const columns = [
	{ Header: 'Name', accessor: 'name', disableSortBy: true },
	{ Header: 'Email', accessor: 'email', disableSortBy: true },
	{
		Header: 'Age',
		accessor: 'birth_date',
		disableSortBy: true,
		Cell: ({ value }) => {
			var ageDifMs = Date.now() - new Date(value).getTime();
			var ageDate = new Date(ageDifMs);

			return Math.abs(ageDate.getUTCFullYear() - 1970);
		},
	},
	{
		Header: 'Years of Experience',
		accessor: 'year_of_experience',
	},
	{ Header: 'Position applied', accessor: 'position_applied' },
	{ Header: 'Applied', accessor: 'application_date' },
	{ Header: 'Status', accessor: 'status', disableSortBy: true },
];

export default columns;
