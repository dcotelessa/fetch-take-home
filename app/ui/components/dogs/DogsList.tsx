import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDogs, { Dog } from '@/app/hooks/useDogs';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import { FiltersContext } from '@/app/context/FiltersContext';
import LoadingIcon from '../icons/LoadingIcon';
import DogsCard from './DogsCard';
import BestMatchCard from './BestMatchCard';

const DogsList = () => {
	const router = useRouter();
	const { searchResults, loading: filtersLoading, error: filtersError } = useContext(FiltersContext);
	const { resultIds = [] } = searchResults || {};
	const [loaded, setLoaded] = useState<boolean>(false);
	const { starredDogsIds, toggleFavorite, totalStarredDogsIds } = useContext(FavoritesContext);

	const { dogs, loading: dogsLoading, error: dogsError } = useDogs(resultIds);

	// Loaded state happens when the page mounts, not when the component mounts
	// allowing for css animations to activate
	useEffect(() => {
		setLoaded(true);
	}, []);

	// most errors are unauthorized, so redirect to login
	useEffect(() => {
		if (dogsError || filtersError) {
			router.push(`/login`);
		}
	}, [dogsError, router]);

	if (dogsError) {
		return (
			<div className="loading page-root">
				<div className={`container ${loaded ? 'loaded' : ''}`}>
					<p>Logging Out...</p>
				</div>
			</div>
		)
	}

	if (dogsLoading || filtersLoading) {
		return (
			<div className="loading modal">
				<div className={`container ${loaded ? 'loaded' : ''}`}>
					<p>Finding dogs</p>
					<LoadingIcon />
				</div>
			</div>
		);
	}

	if (!dogs?.length && totalStarredDogsIds === 0) {
		return <div>No dogs found</div>;
	}

	return (
		<div className="grid">
			<BestMatchCard />
			{dogs?.map((dog: Dog) => (
				<DogsCard
					key={dog.id}
					dog={dog}
					favorite={starredDogsIds.includes(dog.id)}
					onToggleStar={toggleFavorite}
				/>
			))}
		</div>);
};

export default DogsList;
