import { useState, useEffect, useMemo } from 'react';

interface DogBreedsProps {
	breeds: string[];
	error: string | null;
}

export const useDogBreeds = (): DogBreedsProps => {
	const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
	const [breeds, setBreeds] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	const memoizedBreeds = useMemo(() => breeds, [breeds]);

	// Fetch breeds on mount
	useEffect(() => {
		const fetchBreeds = async () => {
			try {
				const response = await fetch(`${fetchUrl}/dogs/breeds`, {
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				if (response.ok) {
					const breedsData = await response.json();
					setBreeds(breedsData);
				} else {
					throw new Error(`response status: ${response.status}`);
				}
			} catch (err: any) {
				setError(`BREEDS ERROR: ${err.message}`);
			}
		};
		fetchBreeds();
	}, []);

	return { breeds: memoizedBreeds, error };
}

export default useDogBreeds;
