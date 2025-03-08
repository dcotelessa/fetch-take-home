import React, { useContext } from 'react';
import { FiltersContext } from '@/app/context/FiltersContext';
import './AgeRangeSelection.css';

const AgeRange: React.FC = () => {
	const {
		params,
		handleParamsChange,
		handleAgeCheckboxChange,
		MAX_AGE,
	} = useContext(FiltersContext);

	const handleSliderChange = (type: 'min' | 'max') => (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(event.target.value, 10);
		let newAgeMin, newAgeMax;
		if (type === 'min') {
			if (value <= params.ageMax) {
				newAgeMin = value;
			}
		} else {
			if (value >= params.ageMin) {
				newAgeMax = value;
			}
		}
		handleParamsChange({ ageMin: newAgeMin || params.ageMin, ageMax: newAgeMax || params.ageMax });
	};

	const handleCheckboxClick = (type: 'min' | 'max') => () => {
		handleAgeCheckboxChange(type);
	}

	return (
		<div className="age-range">
			<h2>Filter by Age Range</h2>
			<div>
				<input
					type="checkbox"
					name="ageMinEnabled"
					checked={params.ageMinEnabled}
					onChange={handleCheckboxClick('min')}
				/>
				<label>Age Min:</label>
				<input
					type="range"
					min={0}
					max={MAX_AGE}
					value={params.ageMin}
					onChange={handleSliderChange('min')}
					name="ageMin"
					disabled={!params.ageMinEnabled}
				/>
				<span>{params.ageMin}</span>
			</div>
			<div>
				<input
					type="checkbox"
					name="ageMaxEnabled"
					checked={params.ageMaxEnabled}
					onChange={handleCheckboxClick('max')}
				/>
				<label>Age Max:</label>
				<input
					type="range"
					min={0}
					max={MAX_AGE}
					value={params.ageMax}
					onChange={handleSliderChange('max')}
					name="ageMax"
					disabled={!params.ageMaxEnabled}
				/>
				<span>{params.ageMax}</span>
			</div>
		</div>
	);
};

export default AgeRange;
