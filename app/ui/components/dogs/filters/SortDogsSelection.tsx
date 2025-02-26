import React, { useCallback, useContext } from 'react';
import { SortDogsContext } from '@/app/context/SortDogsContext';
import './SortDogsSelection.css';

const SortDogsSelection = () => {
	const { sort, setSort } = useContext(SortDogsContext);
	const [currentField, currentDirection] = sort.split(':');

	const handleSortChange = (field: string) => {
		if (field === currentField) {
			const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
			setSort(`${field}:${newDirection}`);

		} else {
			setSort(`${field}:asc`);
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
