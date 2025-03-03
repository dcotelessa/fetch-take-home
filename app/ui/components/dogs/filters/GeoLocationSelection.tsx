import React, { useContext } from 'react';
import { LocationContext } from '@/app/context/LocationContext';

const GeoLocationOptions = () => {
	const { geoLocationOptions, handleGeoLocationOptionsChange } = useContext(LocationContext);

	const handleRadiusChange = (radius: number) => {
		handleGeoLocationOptionsChange({ radius });
	};

	const { radius } = geoLocationOptions;

	return (
		<div className="geolocation-selection">
			<h2>Radius Size:</h2>
			<div className="radius-buttons">
				<button
					className={`filter-button ${radius === 5 ? 'active' : ''}`}
					onClick={() => handleRadiusChange(5)}
				>
					5 miles
				</button>
				<button
					className={`filter-button ${radius === 10 ? 'active' : ''}`}
					onClick={() => handleRadiusChange(10)}
				>
					10 miles
				</button>
				<button
					className={`filter-button ${radius === 25 ? 'active' : ''}`}
					onClick={() => handleRadiusChange(25)}
				>
					25 miles
				</button>
				<button
					className={`filter-button ${radius === 50 ? 'active' : ''}`}
					onClick={() => handleRadiusChange(50)}
				>
					50 miles
				</button>
				<input type="hidden" name="size" value={radius} />
			</div>
		</div>
	);
};

export default GeoLocationOptions;
