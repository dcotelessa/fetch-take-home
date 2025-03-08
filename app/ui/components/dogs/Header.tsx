'use client';

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import useDogsParams from '@/app/hooks/useDogsParams';
import DogSearchFilters from './filters';
import LoadingIcon from '../icons/LoadingIcon';
import DogIcon from '../icons/DogIcon';
import './Header.css';

const Header = () => {
	const { params, searchResults, totalPages, currentPage } = useDogsParams();
	const { total } = searchResults || { total: 0 };
	const fetchUrl = process.env.NEXT_PUBLIC_FETCH_URL || ''
	const router = useRouter();
	const { totalStarredDogsIds } = useContext(FavoritesContext);
	const [loggingOut, setLoggingOut] = useState(false);

	const handleLogout = async () => {
		setLoggingOut(true);
		try {
			const response: Response = await fetch(`${fetchUrl}/auth/logout`, {
				method: 'POST',
				credentials: 'include',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('LOGOUT ERROR: Logout failed');
			}

			router.push(`/login?${params.toString()}`);
		} catch (err: Error | unknown) {
			console.error(err instanceof Error ? err.message : "ERROR: Unknown error on logout");
		}
	};

	return (
		<header className="header">
			<div className="header-logo">
				<DogIcon />
				<h1>Dog Match</h1>
			</div>
			<DogSearchFilters />
			<div className="header-actions">
				{totalStarredDogsIds && (
					<>
						<span className="total-starred">
							{totalStarredDogsIds} ★
						</span>
						{' | '}
					</>
				) || null}
				{totalPages && currentPage && (
					<>
						<span className="total-pages">{`Page ${currentPage} of ${totalPages}`}</span>
						{' | '}
					</>
				)}
				<span className="total-items">{total} total results</span>
				{loggingOut ? (
					<LoadingIcon />
				) : (
					<button onClick={handleLogout}>Logout</button>
				)}
			</div>
		</header>
	);
};

export default Header;
