import React, { useContext } from 'react';
import { FiltersContext } from '@/app/context/FiltersContext';
import './SizeSelection.css';

const SizeSelection = () => {
	const {
		params,
		handleParamsChange,
	} = useContext(FiltersContext);

	const handleSizeChange = (newSize: number) => {
		handleParamsChange({ size: newSize });
	};

	return (
		<div className="size-selection">
			<h2>Results per page:</h2>
			<div className="size-buttons">
				<button
					className={`filter-button ${params.size === 25 ? 'active' : ''}`}
					onClick={() => handleSizeChange(25)}
				>
					25
				</button>
				<button
					className={`filter-button ${params.size === 50 ? 'active' : ''}`}
					onClick={() => handleSizeChange(50)}
				>
					50
				</button>
				<button
					className={`filter-button ${params.size === 75 ? 'active' : ''}`}
					onClick={() => handleSizeChange(75)}
				>
					75
				</button>
				<button
					className={`filter-button ${params.size === 100 ? 'active' : ''}`}
					onClick={() => handleSizeChange(100)}
				>
					100
				</button>
				<input type="hidden" name="size" value={params.size} />
			</div>
		</div>
	);
};

export default SizeSelection;
