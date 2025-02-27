import { useState, useEffect } from 'react';

/**
 * Represents a dog with its basic information and characteristics.
 * @interface Dog
 */
export interface Dog {
	/** Unique identifier for the dog */
	id: string;
	/** URL to the dog's image */
	img: string;
	/** Name of the dog */
	name: string;
	/** Age of the dog in years */
	age: number;
	/** ZIP code indicating the dog's location */
	zip_code: string;
	/** Breed or breed mix of the dog */
	breed: string;
}

const useDogs = (dogIds: string[]) => {
	const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
	const [dogs, setDogs] = useState<Dog[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<null | string>(null);

	useEffect(() => {
		const fetchDogs = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${fetchUrl}/dogs`, {
					method: 'POST',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(dogIds),
				});

				if (response.ok) {
					const searchData = await response.json();
					setDogs(searchData);
				} else {
					throw new Error(`response status: ${response.status}`);
				}
			} catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
				setError(`DOGS ERROR: ${err?.message}`);
			} finally {
				setLoading(false);
			}
		};
		fetchDogs();
	}, [dogIds, fetchUrl]);

	return { dogs, loading, error };
};

export default useDogs;
