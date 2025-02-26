import React, { useContext } from 'react';
import { AgeRangeContext } from '@/app/context/AgeRangeContext';
import './AgeRangeSelection.css';

const AgeRange: React.FC = () => {
	const {
		ageMin,
		ageMax,
		ageMinEnabled,
		ageMaxEnabled,
		handleAgeRangeChange,
		handleCheckboxChange,
		MAX_AGE,
	} = useContext(AgeRangeContext);

	const handleSliderChange = (type: 'min' | 'max') => (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(event.target.value, 10);
		let newAgeMin, newAgeMax;
		if (type === 'min') {
			if (value <= ageMax) {
				newAgeMin = value;
			}
		} else {
			if (value >= ageMin) {
				newAgeMax = value;
			}
		}
		handleAgeRangeChange(newAgeMin || ageMin, newAgeMax || ageMax);
	};

	const handleCheckboxClick = (type: 'min' | 'max') => () => {
		handleCheckboxChange(type);
	}

	return (
		<div className="age-range">
			<h2>Filter by Age Range</h2>
			<div>
				<input
					type="checkbox"
					name="ageMinEnabled"
					checked={ageMinEnabled}
					onChange={handleCheckboxClick('min')}
				/>
				<label>Age Min:</label>
				<input
					type="range"
					min={0}
					max={MAX_AGE}
					value={ageMin}
					onChange={handleSliderChange('min')}
					name="ageMin"
					disabled={!ageMinEnabled}
				/>
				<span>{ageMin}</span>
			</div>
			<div>
				<input
					type="checkbox"
					name="ageMaxEnabled"
					checked={ageMaxEnabled}
					onChange={handleCheckboxClick('max')}
				/>
				<label>Age Max:</label>
				<input
					type="range"
					min={0}
					max={MAX_AGE}
					value={ageMax}
					onChange={handleSliderChange('max')}
					name="ageMax"
					disabled={!ageMaxEnabled}
				/>
				<span>{ageMax}</span>
			</div>
		</div>
	);
};

export default AgeRange;
