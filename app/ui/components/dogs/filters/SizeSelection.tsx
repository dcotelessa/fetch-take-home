import React, { useContext } from 'react';
import { SizeContext } from '@/app/context/SizeContext';
import './SizeSelection.css';

const SizeSelection = () => {
	const { size, setSize } = useContext(SizeContext);

	const handleSizeChange = (newSize: number) => {
		setSize(newSize);
	};

	return (
		<div className="size-selection">
			<h2>Results per page:</h2>
			<div className="size-buttons">
				<button
					className={`filter-button ${size === 25 ? 'active' : ''}`}
					onClick={() => handleSizeChange(25)}
				>
					25
				</button>
				<button
					className={`filter-button ${size === 50 ? 'active' : ''}`}
					onClick={() => handleSizeChange(50)}
				>
					50
				</button>
				<button
					className={`filter-button ${size === 75 ? 'active' : ''}`}
					onClick={() => handleSizeChange(75)}
				>
					75
				</button>
				<button
					className={`filter-button ${size === 100 ? 'active' : ''}`}
					onClick={() => handleSizeChange(100)}
				>
					100
				</button>
				<input type="hidden" name="size" value={size} />
			</div>
		</div>
	);
};

export default SizeSelection;
