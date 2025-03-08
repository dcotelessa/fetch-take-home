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
		const newParams = new URLSearchParams(params.toString());
		newParams.delete('size');
		newParams.delete('from');
		newParams.set('size', size.toString());
		newParams.set('from', from.toString());
		router.push(`?${newParams.toString()}`);
	};

	const buttons = Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
		<button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? 'active' : ''}>
			{page}
		</button>
	));

	// Filter the buttons to only show range around current page
	const filteredPrevButtons = buttons.slice(Math.max(currentPage - 6, 0), Math.max(currentPage - 1, 0));

	const filteredNextButtons = buttons.slice(currentPage, currentPage + 4);

	// with filters searchResults prev and next are not reliable
	const next = params.from + size;
	const hasNext = next < searchResults.total;
	const hasPrev = params.from >= size;

	const hasFirst = currentPage > 6;
	const hasLast = currentPage + 4 < totalPages;

	return (
		<div className="pagination">
			{hasFirst && (
				<button onClick={() => handlePageChange(1)}>First</button>
			)}
			{filteredPrevButtons}
			{hasPrev && (
				<button onClick={() => handlePageChange(currentPage - 1)}>◂ {currentPage - 1}</button>
			)}
			<button disabled>{currentPage}</button>
			{hasNext && (
				<button onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1} ▸</button>
			)}
			{filteredNextButtons}
			{hasLast && (
				<button onClick={() => handlePageChange(totalPages)}>Last</button>
			)}
		</div>
	);
};

export default Pagination;
