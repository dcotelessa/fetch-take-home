import React, { useContext, useMemo, useState } from 'react';
import useDogsBreeds from '@/app/hooks/useDogsBreeds';
import { SelectedBreedsContext } from '@/app/context/SelectedBreedsContext';
import './BreedsSelection.css';

const BreedsSelection: React.FC = () => {
	const { breeds, error } = useDogsBreeds();
	const { selectedBreeds, handleBreedChange, applyBreedChanges } = useContext(SelectedBreedsContext);
	const [filterText, setFilterText] = useState('');

	const handleFilterTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilterText(event.target.value);
	};

	const filteredBreeds = useMemo(() => {
		return breeds.filter((breed) => breed.toLowerCase().includes(filterText.toLowerCase()));
	}, [breeds, filterText]);

	const renderedBreeds = useMemo(() => {
		if (filteredBreeds.length === 0) {
			return <p>Rendering Breeds...</p>;
		}
		return filteredBreeds.map((breed) => (
			<div
				key={breed}
				className={`breed-item ${selectedBreeds.includes(breed) ? 'selected' : ''}`}
				onClick={() => handleBreedChange(breed)}
			>
				<input
					type="checkbox"
					checked={selectedBreeds.includes(breed)}
					onChange={() => handleBreedChange(breed)}
				/>
				<span>{breed}</span>
			</div>
		));
	}, [filteredBreeds, selectedBreeds, handleBreedChange]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="breeds">
			<h2>Filter by Breed</h2>
			<input
				type="text"
				value={filterText}
				onChange={handleFilterTextChange}
				placeholder="Filter breeds"
			/>
			<div className="filters-grid">
				{renderedBreeds}
			</div>
			{selectedBreeds.length > 0 && (
				<button 
					className="apply-breeds-button" 
					onClick={applyBreedChanges}
				>
					Apply {selectedBreeds.length} breed filters
				</button>
			)}
		</div>
	);
};

export default BreedsSelection;
