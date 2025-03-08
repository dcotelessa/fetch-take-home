import { useState, useEffect } from 'react';
import { Coordinates } from './useLocation';

interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: Coordinates;
    left?: Coordinates;
    bottom?: Coordinates;
    right?: Coordinates;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
  };
  size?: number;
  from?: number;
}

const useLocationParams = () => {
	const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
	const [locationParams, setLocationParams] = useState<LocationSearchParams | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<null | string>(null);

	useEffect(() => {
		const fetchLocationParams = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${fetchUrl}/locations/search`, {
					method: 'POST',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(locationParams),
				});

				if (response.ok) {
					const searchData = await response.json();
					setLocationParams(searchData);
				} else {
					throw new Error(`response status: ${response.status}`);
				}
			} catch (err: any) {
				setError(`LOCATION ERROR: ${err.message}`);
			} finally {
				setLoading(false);
			}
		};
		fetchLocationParams();
	}, [locationParams]);

	return { locationParams, loading, error };
};

export default useLocationParams;
