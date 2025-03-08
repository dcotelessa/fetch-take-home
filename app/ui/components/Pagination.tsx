import React from 'react';
import { useRouter } from 'next/navigation';
import useDogsParams from '@/app/hooks/useDogsParams';
import './Pagination.css';

const Pagination: React.FC = () => {
	const router = useRouter();
	const { params, searchResults, totalPages, currentPage, size } = useDogsParams();

	if (totalPages === null || currentPage === null) {
		return null;
	}

	const handlePageChange = (page: number) => {
		const from = (page - 1) * size;
		const searchParams = new URLSearchParams(params.toString());
		searchParams.delete('size');
		searchParams.delete('from');
		searchParams.set('size', size.toString());
		searchParams.set('from', from.toString());
		router.push(`?${searchParams.toString()}`);
	};

	const buttons = Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
		<button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? 'active' : ''}>
			{page}
		</button>
	));

	// Filter the buttons to only show range around current page
	const filteredPrevButtons = buttons.slice(Math.max(currentPage - 6, 0), Math.max(currentPage - 2,0));

	const filteredNextButtons = buttons.slice(currentPage + 1, currentPage + 5);

	// with filters searchResults prev and next are not reliable
	const from = parseInt(params.get('from') || '0', 10);
	const next = from + size;
	const hasNext = next < searchResults.total;
	const hasPrev = from >= size;

	const hasFirst = currentPage > 6;
	const hasLast = currentPage + 5 < totalPages;

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
