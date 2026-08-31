"use client";

import styles from "./Gallery.module.css";
import { useState, useMemo } from "react";
import type { Media } from "@prisma/client";
import GalleryModal from "../GalleryModal/GalleryModal";
import { likeMedia } from "@/app/actions/likeMedia";

interface GalleryProps {
	initialMedias: Media[];
	price: number;
}

export default function Gallery({ initialMedias, price }: GalleryProps) {
	//Liste des médias sera mise à jour au moment de liké
	const [medias, setMedias] = useState(initialMedias);
	//option pour le trie
	const [sortValue, setSortValue] = useState("popularity");
	//Pour savoir si la modal est ouverte
	const [isModalOpen, setIsModalOpen] = useState(false);
	//pour savoir sur quelle image on à cliqué pour la modale
	const [indexClicked, setIndexClicked] = useState(0);
	//liste des id d'images qu'on à liké
	const [arrayLiked, setArrayLiked] = useState(
		Object.fromEntries(medias.map((media) => [media.id, false])),
	);

	const numLikes = medias.reduce((total, media) => total + media.likes, 0);

	async function handleLike(id: number) {
		if (arrayLiked[id] === true) {
			return;
		}

		setArrayLiked((prevState) => ({
			...prevState, // copie toutes les clés existantes
			[id]: true, // écrase uniquement la clé `id` avec la nouvelle valeur
		}));

		//mettre à jour les likes dans la base de donnée

		const media = medias.find((m) => m.id === id);
		if (!media) {
			return;
		}
		const newLikes = media.likes + 1;
		// Appel réseau vers le serveur, qui exécute Prisma
		const updatedMedia = await likeMedia(id, newLikes);
		setMedias((prev) => prev.map((m) => (m.id === id ? updatedMedia : m)));
	}

	function onOpen(index: number) {
		setIndexClicked(index);
		setIsModalOpen(true);
	}

	const sortedMedias = useMemo(() => {
		switch (sortValue) {
			case "popularity":
				return [...medias].sort((a, b) => b.likes - a.likes);
			case "date":
				return [...medias].sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
				);
			case "title":
				return [...medias].sort((a, b) => a.title.localeCompare(b.title));
			default:
				return [...medias].sort((a, b) => b.likes - a.likes);
		}
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
				{sortedMedias.map((media, index) => (
					<figure key={media.id} className={styles.card}>
						{/* #9 - Lien vers la lightbox : le texte alternatif est porté par l'image elle-même */}
						<button
							onClick={() => onOpen(index)}
							className={styles.buttonImg}
						>
							{media.image ? (
								<img
									src={`/${media.image}`}
									alt={media.title}
									className={styles.thumbnail}
								/>
							) : (
								<video
									src={`/${media.video}`}
									className={styles.thumbnail}
									muted // obligatoire pour autoplay sans interaction utilisateur (politique des navigateurs)
									preload="metadata"
									playsInline // évite le fullscreen forcé sur iOS Safari
									aria-label={media.title}
								/>
							)}
						</button>

						<figcaption className={styles.caption}>
							{/* #10 - Titre visible */}
							<span className={styles.title}>{media.title}</span>

							<span className={styles.likesWrapper}>
								<button
									type="button"
									aria-label={`Like ${media.title}, ${media.likes} likes`}
									aria-pressed={arrayLiked[media.id] ?? false}
									className={styles.likeButton}
									onClick={() => handleLike(media.id)}
								>
									<span className={styles.likesCount}>
										{media.likes}
									</span>
									{/* aria-hidden car l'info est déjà portée par aria-label du bouton */}

									<img
										src={
											arrayLiked[media.id]
												? "/like.svg"
												: "/likeNo.svg"
										}
										aria-hidden="true"
										className={styles.likeIcon}
									/>
								</button>
							</span>
						</figcaption>
					</figure>
				))}
			</section>

			<article className={styles.infoPage}>
				<div className={styles.likeContainer}>
					<p>{numLikes}</p>
					<img src="/likeBlack.svg" className={styles.blackLike} />
				</div>
				<p>{price.toString()}€/jour</p>
			</article>

			{isModalOpen && (
				<GalleryModal
					medias={sortedMedias}
					onClose={() => setIsModalOpen(false)}
					indexClicked={indexClicked}
				/>
			)}
		</>
	);
}
