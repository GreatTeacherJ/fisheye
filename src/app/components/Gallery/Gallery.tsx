"use client";

import styles from "./Gallery.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Media } from "@prisma/client";
import GalleryModal from "../GalleryModal/GalleryModal";

interface Medias {
	medias: Media[];
}

//variable teste pour voir si l'image est likée
let liked = false;

export default function Gallery({ medias }: Medias) {
	const [sortValue, setSortValue] = useState("popularity");
	const [sortedMedias, setSortedMedias] = useState<Media[]>(medias);
	const [isModalOpen, setIsModalOpen] = useState(false);

	function handleLike(id: number) {}

	function onOpen() {
		setIsModalOpen(true);
	}

	useEffect(() => {
		// Toujours copier avant de trier : ne jamais muter le tableau original/prop
		let sorted: Media[];
		switch (sortValue) {
			case "popularity":
				sorted = [...medias].sort((a, b) => b.likes - a.likes);
				break;
			case "date":
				sorted = [...medias].sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
				);
				break;
			case "title":
				sorted = [...medias].sort((a, b) => a.title.localeCompare(b.title));
				break;
			default:
				sorted = [...medias].sort((a, b) => b.likes - a.likes);
				break;
		}
		setSortedMedias(sorted);
	}, [sortValue, medias]);

	return (
		<>
			<section className={styles.sortSection}>
				{/* #7 - Texte statique */}
				<span className={styles.sortLabel} id="sort-label">
					Trier par
				</span>

				{/* #8 - Input label relié au select via htmlFor/id */}
				{/* Choix : <select> natif plutôt que ARIA listbox custom :
            - accessibilité native au clavier/lecteur d'écran gérée par le navigateur
            - moins de code, moins de bugs, pas besoin de gérer aria-expanded/haspopup manuellement
            Le tableau autorise les deux approches ; ici on privilégie la simplicité et la robustesse */}
				<label htmlFor="sort-select" className={styles.srOnly}>
					Order by
				</label>
				<select
					id="sort-select"
					className={styles.sortSelect}
					defaultValue="popularity"
					onChange={(event) => setSortValue(event.target.value)}
				>
					<option value="popularity">Popularité</option>
					<option value="date">Date</option>
					<option value="title">Titre</option>
				</select>
			</section>
			<section className={styles.gallery} aria-label="Photo gallery">
				{sortedMedias.map((media) => (
					<figure key={media.id} className={styles.card}>
						{/* #9 - Lien vers la lightbox : le texte alternatif est porté par l'image elle-même */}
						<button onClick={onOpen} className={styles.buttonImg}>
							{media.image ? (
								<img
									src={`/${media.image}`}
									alt={`${media.title}, closeup view`}
									className={styles.thumbnail}
								/>
							) : (
								<video
									src={`/${media.video}`}
									className={styles.thumbnail}
									muted // obligatoire pour autoplay sans interaction utilisateur (politique des navigateurs)
									autoPlay
									loop
									playsInline // évite le fullscreen forcé sur iOS Safari
									aria-label={`${media.title}, closeup view`}
								/>
							)}
						</button>

						<figcaption className={styles.caption}>
							{/* #10 - Titre visible */}
							<span className={styles.title}>{media.title}</span>

							<span className={styles.likesWrapper}>
								{/* #11 - Bouton interactif, aria-pressed pour l'état liked/unliked */}
								<button
									type="button"
									aria-label={`Like ${media.title}, ${media.likes} likes`}
									aria-pressed={liked ?? false}
									className={styles.likeButton}
									onClick={() => handleLike(media.id)}
								>
									<span className={styles.likesCount}>
										{media.likes}
									</span>
									{/* aria-hidden car l'info est déjà portée par aria-label du bouton */}

									<img
										src="/like.svg"
										aria-hidden="true"
										className={styles.likeIcon}
									/>
								</button>
							</span>
						</figcaption>
					</figure>
				))}
			</section>
			{isModalOpen && (
				<GalleryModal
					sortedMedias={sortedMedias}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</>
	);
}
