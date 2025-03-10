import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FiltersContext } from '@/app/context/FiltersContext';
import './Pagination.css';

const Pagination: React.FC = () => {
	const router = useRouter();
	const { params, searchResults, totalPages, currentPage, size } = useContext(FiltersContext);

	if (!searchResults || totalPages === null || currentPage === null || totalPages <= 1) {
		return null;
	}

	const handlePageChange = (page: number) => {
		const from = (page - 1) * size;
		
		// Create URLSearchParams to build the query
		const queryParams = new URLSearchParams();
		
		console.log("Pagination - Current params:", params); // Debugging
		
		// Add all current params
		if (params.breeds.length > 0) {
			console.log("Pagination - Adding breeds:", params.breeds.join(',')); // Debugging
			queryParams.set('breeds', params.breeds.join(','));
		}
		
		if (params.zipCodes.length > 0) {
			queryParams.set('zipCodes', params.zipCodes.join(','));
		}
		
		if (params.ageMinEnabled && params.ageMin > 0) {
			queryParams.set('ageMin', params.ageMin.toString());
		}
		
		if (params.ageMaxEnabled && params.ageMax < 20) {
			queryParams.set('ageMax', params.ageMax.toString());
		}
		
		// Add sort if it's not the default
		if (params.sort !== 'breed:asc') {
			queryParams.set('sort', params.sort);
		}
		
		// Update with new pagination values
		queryParams.set('size', size.toString());
		queryParams.set('from', from.toString());
		
		console.log("Pagination - Final query:", queryParams.toString()); // Debugging
		
		// Navigate to the new URL
		router.push(`/?${queryParams.toString()}`);
	};

	const buttonsToShow = 5; // Total number of page buttons to show
	const halfButtonsToShow = Math.floor(buttonsToShow / 2);
	
	// Calculate range of buttons to display
	let startPage = Math.max(1, currentPage - halfButtonsToShow);
	const endPage = Math.min(totalPages, startPage + buttonsToShow - 1);
	
	// Adjust start page if we're near the end
	if (endPage - startPage + 1 < buttonsToShow) {
		startPage = Math.max(1, endPage - buttonsToShow + 1);
	}
	
	// Generate visible page buttons
	const visibleButtons = [];
	for (let i = startPage; i <= endPage; i++) {
		visibleButtons.push(
			<button 
				key={i} 
				onClick={() => handlePageChange(i)} 
				className={currentPage === i ? 'active' : ''}
			>
				{i}
			</button>
		);
	}

	// Calculate if we should show prev/next buttons
	const hasNext = currentPage < totalPages;
	const hasPrev = currentPage > 1;
	
	// Determine if we should show first/last page buttons
	const hasFirst = startPage > 1;
	const hasLast = endPage < totalPages;

	return (
		<div className="pagination">
			{hasFirst && (
				<button onClick={() => handlePageChange(1)}>First</button>
			)}
			
			{hasPrev && (
				<button onClick={() => handlePageChange(currentPage - 1)}>◂ Prev</button>
			)}
			
			{visibleButtons}
			
			{hasNext && (
				<button onClick={() => handlePageChange(currentPage + 1)}>Next ▸</button>
			)}
			
			{hasLast && (
				<button onClick={() => handlePageChange(totalPages)}>Last</button>
			)}
		</div>
	);
};

export default Pagination;
