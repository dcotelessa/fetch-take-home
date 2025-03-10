import React, { useContext, useMemo, useState } from 'react';
import { FiltersContext } from '@/app/context/FiltersContext';
import { SelectedBreedsContext } from '@/app/context/SelectedBreedsContext';
import SliderHorizontal3 from '../../icons/SliderHorizontal3';
import BreedsSelection from './BreedsSelection';
import AgeRangeSelection from './AgeRangeSelection';
import SortDogsSelection from './SortDogsSelection';
import SizeSelection from './SizeSelection';
import LocationSelection from './LocationSelection';
import './FiltersComponent.css';

const FiltersComponent = () => {
	const [showDropdown, setShowDropdown] = useState(false);
	const { updateSearchParams, fetchDogs } = useContext(FiltersContext);
	const { selectedBreeds } = useContext(SelectedBreedsContext);

	const handleToggle = () => {
		setShowDropdown(!showDropdown);
	};

	const handleApply = () => {
		console.log("Applying all filters with breeds:", selectedBreeds); // Debugging
		
		// Apply all filter changes with selected breeds
		updateSearchParams(selectedBreeds);
		
		// Fetch dogs with the new filters
		fetchDogs();
		
		// Close the dropdown
		setShowDropdown(false);
	};

	const dropdown = useMemo(() => {
		return (
			<div className={`filters-dropdown ${showDropdown ? 'show' : ''}`}>
				<div className="filters-content">
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
				<div className="filters-actions">
					<button onClick={handleApply} className="apply-filters-button">
						Apply All Filters
					</button>
					<button onClick={() => setShowDropdown(false)} className="close-filters-button">
						Close
					</button>
				</div>
			</div>
		);
	}, [showDropdown, handleApply, fetchDogs, selectedBreeds]);

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

export default FiltersComponent;
