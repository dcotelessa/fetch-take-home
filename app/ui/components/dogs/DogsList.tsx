import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingIcon from '../icons/LoadingIcon';
import useDogs, { Dog } from '@/app/hooks/useDogs';
import { FavoritesContext } from '@/app/context/FavoritesContext';
import DogsCard from './DogsCard';
import BestMatchCard from './BestMatchCard';

const DogsList = ({ dogIds }: { dogIds: string[] }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams.toString());
	const [loaded, setLoaded] = useState<boolean>(false);
	const { starredDogsIds, toggleFavorite, totalStarredDogsIds } = useContext(FavoritesContext);

	const { dogs, loading, error } = useDogs(dogIds);

	// Loaded state happens when the page mounts, not when the component mounts
	// allowing for css animations to activate
	useEffect(() => {
		setLoaded(true);
	}, []);

	// most errors are unauthorized, so redirect to login
	useEffect(() => {
		if (error) {
			router.push(`/login?${params.toString()}`);
		}
	}, [error, router]);

	if (error) {
		return (
			<div className="loading page-root">
				<div className={`container ${loaded ? 'loaded' : ''}`}>
					<p>Logging Out...</p>
				</div>
			</div>
		)
	}

	if (loading) {
		return (
			<div className="loading modal">
				<div className={`container ${loaded ? 'loaded' : ''}`}>
					<p>Finding dogs</p>
					<LoadingIcon />
				</div>
			</div>
		);
	}

	if (!dogs && totalStarredDogsIds === 0) {
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
