'use client'

import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import { Dog } from '@/app/hooks/useDogs';

interface Match {
	match: string;
}

const useDogsMatch = () => {
	const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
	const [match, setMatch] = useState<Match | null>(null);
	const [matchedDogs, setMatchedDogs] = useState<Dog[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { starredDogsIds, totalStarredDogsIds } = useContext(FavoritesContext);

	useEffect(() => {
		const fetchMatch = async () => {
			if (totalStarredDogsIds > 0) {
				setLoading(true);
				setError(null);
				try {
					const response = await fetch(`${fetchUrl}/dogs/match`, {
						method: 'POST',
						credentials: 'include',
						mode: 'cors',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(starredDogsIds),
					});

					if (response.ok) {
						const searchData = await response.json();
						setMatch(searchData);
					} else {
						throw new Error(`response status: ${response.status}`);
					}
				} catch (err: any) {
					setError(`MATCH ERROR: ${err.message}`);
				} finally {
					setLoading(false);
				}
			} else {
				setMatch(null);
			}
		};
		fetchMatch();
	}, [starredDogsIds]);

	useEffect(() => {
		if (match) {
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
						body: JSON.stringify([match.match]),
					});

					if (response.ok) {
						const searchData = await response.json();
						setMatchedDogs(searchData);
					} else {
						throw new Error(`response status: ${response.status}`);
					}
				} catch (err: any) {
					setError(`MATCH ERROR: ${err.message}`);
				} finally {
					setLoading(false);
				}
			}
			fetchDogs();
		} else {
			setMatchedDogs([]);
		}
	}, [match]);

	return { match, matchedDogs, loading, error };
};

export default useDogsMatch;
