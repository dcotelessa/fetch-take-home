import { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { SortDogsContext } from '@/app/context/SortDogsContext';

export interface DogParams {
	breeds?: string[];
	zipCodes?: string[];
	ageMin?: number;
	ageMax?: number;
	size?: number;
	from?: number;
	sort?: string;
}

interface DogSearchParams {
	resultIds: string[];
	total: number; // total number of results, not just the current page
	next: string | null; // a query to request the next page of results (if one exists)
	prev: string | null; // a query to request the previous page of results (if one exists)
}

export const MAX_PAGE_SIZE = 25;
export const convertURLSearchParamsToDogParams = (searchParams: URLSearchParams): DogParams => {
	const entries = searchParams.entries();

	return Object.fromEntries(
		Array.from(entries).map(([key, value]) => {
			if (key === 'breeds') {
				return [key, value.split(',')]
			}
			if (key === 'zipCodes') {
				return [key, value.split(',')]
			}
			if (key === 'ageMin' || key === 'ageMax' || key === 'size') {
				return [key, parseInt(value, 10)]
			}
			return [key, value]
		})
	)
}

const useDogsParams = (externalParams: DogParams) => {
	const { DEFAULT_SORT } = useContext(SortDogsContext);
	const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || '';
	const [searchResults, setSearchResults] = useState<DogSearchParams | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const queryString = useMemo(() => {
		const queryParams = new URLSearchParams();

		if (externalParams.breeds?.length) {
			queryParams.append('breeds', externalParams.breeds.join(','));
		}
		if (externalParams.zipCodes?.length) {
			queryParams.append('zipCodes', externalParams.zipCodes.join(','));
		}
		if (externalParams.ageMin) {
			queryParams.append('ageMin', String(externalParams.ageMin));
		}
		if (externalParams.ageMax) {
			queryParams.append('ageMax', String(externalParams.ageMax));
		}
		if (externalParams.size) {
			queryParams.append('size', String(externalParams.size));
		}
		if (externalParams.from) {
			queryParams.append('from', String(externalParams.from));
		}
		// default sort, since the API doesn't have a default
		if (externalParams.sort) {
			queryParams.append('sort', externalParams.sort);
		} else {
			queryParams.append('sort', DEFAULT_SORT);
		}

		return queryParams.toString();
	}, [externalParams, DEFAULT_SORT]);

	const fetchDogs = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`${fetchUrl}/dogs/search?${queryString}`, {
				method: 'GET',
				credentials: 'include',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
					setError(`response status: ${response.status}`);
			}

			const data = await response.json();
			setSearchResults(data);
		} catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
			setError(`DOGS PARAMS ERROR: ${err.message}`);
		} finally {
			setLoading(false);
		}
	}, [fetchUrl, queryString]);

	useEffect(() => {
		fetchDogs();
	}, [fetchDogs]);

	if (!searchResults || !externalParams) {
		return { searchResults, loading, error, totalPages: null, currentPage: null };
	}

	const size = externalParams.size || MAX_PAGE_SIZE;
	const totalPages = Math.ceil(searchResults.total / size);
	const from = externalParams.from || 0;
	const currentPage = Math.floor(from / size) + 1;

	return { searchResults, loading, error, totalPages, currentPage };
};

export default useDogsParams;
