import React, { useContext, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SelectedBreedsContext } from '@/app/context/SelectedBreedsContext';
import { AgeRangeContext } from '@/app/context/AgeRangeContext';
import { SortDogsContext } from '@/app/context/SortDogsContext';
import { SizeContext } from '@/app/context/SizeContext';
import { LocationContext } from '@/app/context/LocationContext';
import SliderHorizontal3 from '../../icons/SliderHorizontal3';
import BreedsSelection from './BreedsSelection';
import AgeRangeSelection from './AgeRangeSelection';
import SortDogsSelection from './SortDogsSelection';
import SizeSelection from './SizeSelection';
import LocationSelection from './LocationSelection';
import './index.css';


const Filters = () => {
	const [showDropdown, setShowDropdown] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { selectedBreeds } = useContext(SelectedBreedsContext);
	const { ageMin, ageMax, MAX_AGE } = useContext(AgeRangeContext);
	const { sort } = useContext(SortDogsContext);
	const { size, DEFAULT_SIZE } = useContext(SizeContext);
	const { zipCodes } = useContext(LocationContext);

	const handleToggle = () => {
		setShowDropdown(!showDropdown);
	};

	const handleApply = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete('breeds');
		selectedBreeds.forEach((breed) => {
			params.append('breeds', breed);
		});
		params.delete('zipCodes');
		zipCodes.forEach((zip) => {
			params.append('zipCodes', zip);
		});
		params.delete('ageMin');
		if (ageMin > 0) {
			params.append('ageMin', ageMin.toString());
		}
		params.delete('ageMax');
		if (ageMax < MAX_AGE) {
			params.append('ageMax', ageMax.toString());
		}

		params.delete('size');
		if (size != DEFAULT_SIZE) {
			params.append('size', size.toString());
		}

		params.delete('sort');
		params.append('sort', sort);
		router.push(`/?${params.toString()}`);
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
