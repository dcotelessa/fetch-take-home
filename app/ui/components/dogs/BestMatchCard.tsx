import { useContext } from 'react';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import useDogsMatch from '@/app/hooks/useDogsMatch';
import DogsCard from './DogsCard';
import LoadingIcon from '../icons/LoadingIcon';
import './BestMatchCard.css';

const BestMatchCard: React.FC = () => {
	const { toggleFavorite } = useContext(FavoritesContext);
	const { matchedDogs, loading, error } = useDogsMatch();

	if (loading) {
		return (
		<div className="best-match-card">
			<h2>Best Match</h2>
			<div className="loading-icon">
				<LoadingIcon />
			</div>
		</div>
		);
	}

	if (error || matchedDogs.length === 0) {
		return (
		<div className="best-match-card">
			<h2>Best Match</h2>
			<div className="no-match">
				<p>Looking for a perfect match?</p>
				<p>We can select from your ★ starred ★ favorites.</p>
			</div>
		</div>
		);
	}

	return (
		<div className="best-match-card">
			<h2>Best Match</h2>
			<DogsCard
				dog={matchedDogs[0]}
				favorite={true}
				onToggleStar={toggleFavorite}
			/>
		</div>
	);
};

export default BestMatchCard;
