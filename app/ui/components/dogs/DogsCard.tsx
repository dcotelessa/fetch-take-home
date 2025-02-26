import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { Dog } from '@/app/hooks/useDogs';
import StarButton from '../StarButton';
import LoadingIcon from '../icons/LoadingIcon';
import './DogsCard.css';

interface DogsCardProps {
	dog: Dog;
	favorite: boolean;
	onToggleStar: (dogId: string) => void;
}

const DogsCard: React.FC<DogsCardProps> = ({ dog, favorite, onToggleStar }) => {
	const { ref, inView } = useInView({
		threshold: 0.5,
	});
	const modalRef = useRef<HTMLDivElement>(null);
	const [isStarred, setIsStarred] = useState(favorite);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleImageClick = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setImageLoaded(false);
	};

	const handleToggleStar = () => {
		setIsStarred(!isStarred);
		onToggleStar(dog.id);
	};

	useEffect(() => {
		if (modalRef.current) {
			if (imageLoaded) {
				modalRef.current.classList.add('animate-in');
			} else {
				modalRef.current.classList.remove('animate-in');
			}
		}
	}, [imageLoaded]);


	return (
		<div className="dog-card">
			<h2 className="dog-name">{dog.name}</h2>
			<div className="dog-image-container">
				<Image
					src={dog.img}
					alt={dog.name}
					width={200}
					height={200}
					onClick={handleImageClick}
					priority={inView}
					ref={ref}
				/>
			</div>
			<div className="dog-info">
				<p>Age: <b>{dog.age}</b></p>
				<p>Zip Code: <b>{dog.zip_code}</b></p>
				<p>Breed: <b>{dog.breed}</b></p>
			</div>
			<StarButton isStarred={isStarred} onToggleStar={handleToggleStar} />
			{showModal && (
				<div className="modal" >
					<div ref={modalRef} className="modal-content">
						<div className="modal-header">
							<StarButton isStarred={isStarred} onToggleStar={handleToggleStar} />
							<button className="close-button" onClick={handleCloseModal}>
								Close
							</button>
						</div>
						<Image
							src={dog.img}
							alt={dog.name}
							width={400}
							height={400}
							onLoad={() => {
								setImageLoaded(true);
							}}
						/>
						<h2 className="dog-name">{dog.name}</h2>
					</div>
					{!imageLoaded && (<div className="loading-icon">
						<LoadingIcon />
					</div>)}
				</div>
			)}
		</div>
	);
};

export default DogsCard;
