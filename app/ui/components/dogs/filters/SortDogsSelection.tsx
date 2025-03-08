import React, { useCallback, useContext } from 'react';
import { FiltersContext } from '@/app/context/FiltersContext';
import './SortDogsSelection.css';

const SortDogsSelection = () => {
	const {
		params,
		handleParamsChange,
	} = useContext(FiltersContext);
	
	const sort = params.sort || 'breed:asc';
	const [currentField, currentDirection] = sort.split(':');

	const handleSortChange = (field: string) => {
		if (field === currentField) {
			const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
			handleParamsChange({ sort: `${field}:${newDirection}` });
		} else {
			handleParamsChange({ sort: `${field}:asc` });
		}
	};

	const determineClass = useCallback((field: string) => {
		if (field !== currentField) {
			return '';
		}

		const dir = currentDirection === 'asc' ? 'asc' : 'desc';
		return `selected ${dir}`;
	}, [currentField, currentDirection]);

	return (
		<div className="sort-selection">
			<h2>Sorting Preference</h2>
			<div className="sort-buttons">
				<button
					className={`sort-button ${determineClass('breed')}`}
					onClick={() => handleSortChange('breed')}
				>
					Breed
				</button>
				<button
					className={`sort-button ${determineClass('name')}`}
					onClick={() => handleSortChange('name')}
				>
					Name
				</button>
				<button
					className={`sort-button ${determineClass('age')}`}
					onClick={() => handleSortChange('age')}
				>
					Age
				</button>
				<input type="hidden" name="sort" value={sort} />
			</div>
		</div>
	);
};

export default SortDogsSelection;
