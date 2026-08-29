"use client";

import styles from "./Gallery.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Media } from "@prisma/client";
import GalleryModal from "../GalleryModal/GalleryModal";
import { likeMedia } from "@/app/actions/likeMedia";

interface Medias {
	initialMedias: Media[];
	price: Number;
}

//variable teste pour voir si l'image est likée
let liked = false;

export default function Gallery({ initialMedias, price }: Medias) {
	//Liste des médias sera mise à jour au moment de liké
	const [medias, setMedias] = useState(initialMedias);
	//option pour le trie
	const [sortValue, setSortValue] = useState("popularity");
	//liste trié des medias
	const [sortedMedias, setSortedMedias] = useState<Media[]>(medias);
	//Pour savoir si la modal est ouverte
	const [isModalOpen, setIsModalOpen] = useState(false);
	//pour savoir sur quelle image on à cliqué pour la modale
	const [indexClicked, setIndexClicked] = useState(0);
	//liste des id d'images qu'on à liké
	const [arrayLiked, setArrayLiked] = useState(
		Object.fromEntries(medias.map((media) => [media.id, false])),
	);

	const numLikes = medias.reduce((total, media) => total + media.likes, 0);

	console.log("tableau des likes : ", arrayLiked);

	//useEffect(() => {}, [arrayLiked]);

	async function handleLike(id: number) {
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
									alt={`${media.title}, closeup view`}
									className={styles.thumbnail}
								/>
							) : (
								<video
									src={`/${media.video}`}
									className={styles.thumbnail}
									muted // obligatoire pour autoplay sans interaction utilisateur (politique des navigateurs)
									preload="metadata"
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
