import Filters from './components/Filters';
import Table from './components/Table';
import { ReactComponent as CompanyLogo } from './assets/personio_logo.svg';
import './App.css';

export default function App() {
	return (
		<>
			<header className="personio-header-container">
				<CompanyLogo style={{ width: '111px' }} />
			</header>
			<main className="personio-main-container">
				<section className="personio-details-container">
					<Filters />
					<Table />
				</section>
			</main>
		</>
	);
}
