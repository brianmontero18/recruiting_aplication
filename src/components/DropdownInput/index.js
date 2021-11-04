import * as React from 'react';
import Input from '../Input';
import './index.css';

export default function DropdownInput({ name, options = '', handleChange }) {
	const [search, setSearch] = React.useState('');
	React.useEffect(() => () => setSearch(''), []);

	return (
		<>
			<Input
				placeholder="Search"
				onChange={(e) => setSearch(e.target.value)}
			/>
			<br />
			<div className="personio-dropdown-list">
				{Object.keys(options).map((element, index) =>
					element.toUpperCase().indexOf(search.toUpperCase()) !==
					-1 ? (
						<React.Fragment key={index}>
							<input
								name={element}
								type="checkbox"
								defaultChecked={options[element]}
								onChange={(e) => handleChange(e, name, options)}
							/>
							<span
								style={{
									marginLeft: '10px',
									cursor: 'initial',
								}}
							>
								{element}
							</span>
							<br />
						</React.Fragment>
					) : null
				)}
				{!Object.keys(options).length ? 'Loading...' : null}
			</div>
		</>
	);
}
