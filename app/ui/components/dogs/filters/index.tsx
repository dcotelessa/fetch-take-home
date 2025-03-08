import React, { useContext, useMemo, useState } from 'react';
import { FiltersContext } from '@/app/context/FiltersContext';
import SliderHorizontal3 from '../../icons/SliderHorizontal3';
import BreedsSelection from './BreedsSelection';
import AgeRangeSelection from './AgeRangeSelection';
import SortDogsSelection from './SortDogsSelection';
import SizeSelection from './SizeSelection';
import LocationSelection from './LocationSelection';
import './index.css';


const Filters = () => {
	const [showDropdown, setShowDropdown] = useState(false);
	const { updateSearchParams } = useContext(FiltersContext);

	const handleToggle = () => {
		setShowDropdown(!showDropdown);
	};

	const handleApply = () => {
		updateSearchParams();
	};

	const dropdown = useMemo(() => {
		return (
			<div className={`filters-dropdown ${showDropdown ? 'show' : ''}`}>
				<div className="filters-column">
					<BreedsSelection />
				</div>
				<div className="filters-column">
					<AgeRangeSelection />
					<SortDogsSelection />
					<SizeSelection />
					<LocationSelection />
				</div>
			</div>
		);
	}, [showDropdown]);

	return (
		<div className="filters">
			<div className="filters-buttons">
				<button className="filters-toggle" onClick={handleToggle}>
					<SliderHorizontal3 />
				</button>
				<button onClick={handleApply}>Apply Filters</button>
			</div>
			{dropdown}
		</div>
	);
};

export default Filters;
