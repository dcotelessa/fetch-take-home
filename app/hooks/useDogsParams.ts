import { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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

export interface DogSearchParams {
	resultIds: string[];
	total: number; // total number of results, not just the current page
	next: string | null; // a query to request the next page of results (if one exists)
	prev: string | null; // a query to request the previous page of results (if one exists)
}

export const MAX_PAGE_SIZE = 25;

const convertURLSearchParamsToDogParams = (searchParams: URLSearchParams): DogParams => {
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

const useDogsParams = () => {
	const externalParams = useSearchParams();
	const params = useMemo(() => new URLSearchParams(externalParams.toString()), [externalParams]);

	const { DEFAULT_SORT } = useContext(SortDogsContext);
	const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || '';
	const [searchResults, setSearchResults] = useState<DogSearchParams | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const searchParams = convertURLSearchParamsToDogParams(params);

	const queryString = useMemo(() => {
		const queryParams = new URLSearchParams();

		if (searchParams.breeds?.length) {
			queryParams.append('breeds', searchParams.breeds.join(','));
		}
		if (searchParams.zipCodes?.length) {
			queryParams.append('zipCodes', searchParams.zipCodes.join(','));
		}
		if (searchParams.ageMin) {
			queryParams.append('ageMin', String(searchParams.ageMin));
		}
		if (searchParams.ageMax) {
			queryParams.append('ageMax', String(searchParams.ageMax));
		}
		if (searchParams.size) {
			queryParams.append('size', String(searchParams.size));
		}
		if (searchParams.from) {
			queryParams.append('from', String(searchParams.from));
		}
		// default sort, since the API doesn't have a default
		if (searchParams.sort) {
			queryParams.append('sort', searchParams.sort);
		} else {
			queryParams.append('sort', DEFAULT_SORT);
		}

		return queryParams.toString();
	}, [searchParams, DEFAULT_SORT]);

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

	if (!searchResults || !searchParams) {
		return { params, searchParams, searchResults, loading, error, totalPages: null, currentPage: null };
	}

	const size = searchParams.size || MAX_PAGE_SIZE;
	const totalPages = Math.ceil(searchResults.total / size);
	const from = searchParams.from || 0;
	const currentPage = Math.floor(from / size) + 1;
	const hasSearchResults = searchResults.resultIds.length > 0;

	return { params, hasSearchResults, searchParams, searchResults, loading, error, totalPages, currentPage, size };
};

export default useDogsParams;
