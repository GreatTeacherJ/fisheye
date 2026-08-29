import { useRef, useEffect, useState } from "react";
import styles from "./GalleryModal.module.css";
import type { Media } from "@prisma/client";

interface GalleryModalProps {
	medias: Media[];
	onClose: () => void;
	indexClicked: number;
}

export default function GalleryModal({
	medias,
	onClose,
	indexClicked,
}: GalleryModalProps) {
	//======================================================

	console.log("index reçu : ", indexClicked);

	//On tri la liste en commençant par l'index sur lequel on a cliqué
	const sortedMedias = rotateFromIndex(medias, indexClicked);

	const dialogRef = useRef<HTMLDialogElement>(null);
	//imgPosition est la position de l'image afficher par rapport à la liste triée
	const [imgPosition, setImgPosition] = useState<number>(0);

	function onNext() {
		setImgPosition((prev) => (prev + 1) % sortedMedias.length);
	}

	function onPrevious() {
		setImgPosition((prev) => (prev - 1 + sortedMedias.length) % sortedMedias.length);
	}

	useEffect(() => {
		const dialogNode = dialogRef.current;
		if (!dialogNode) return;

		dialogNode.showModal();

		function handleClose() {
			onClose();
		}

		// clic sur le backdrop = clic directement sur l'élément <dialog>
		// (le contenu réel est dans un <div> enfant, donc un clic dessus ne remonte pas ici)
		function handleBackdropClick(event: MouseEvent) {
			if (event.target === dialogNode) {
				if (!dialogNode) return;
				dialogNode.close();
			}
		}

		dialogNode.addEventListener("close", handleClose);
		dialogNode.addEventListener("click", handleBackdropClick);

		return () => {
			dialogNode.removeEventListener("close", handleClose);
			dialogNode.removeEventListener("click", handleBackdropClick);
		};
	}, [onClose]);

	//Fonction qui retourne un array avec l'index donné en premier
	function rotateFromIndex<T>(arr: T[], index: number | undefined): T[] {
		// slice(index) → prend tout depuis index jusqu'à la fin
		// slice(0, index) → prend tout avant index
		// concat → recolle les deux morceaux dans le nouvel ordre
		return arr.slice(index).concat(arr.slice(0, index));
	}

	//Pour la navigation au clavier fleche droite et gauche
	useEffect(() => {
		// handler function to react to keyboard events
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "ArrowRight") {
				onNext();
			} else if (event.key === "ArrowLeft") {
				onPrevious();
			}
		}

		// attach listener on mount
		window.addEventListener("keydown", handleKeyDown);

		// cleanup: remove listener on unmount to avoid memory leaks / duplicate listeners
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onNext, onPrevious]); // re-run effect if callbacks change

	return (
		<dialog
			ref={dialogRef}
			className={styles.modal}
			aria-label="media closeup view"
			onClose={onClose} // déclenché par Escape ou dialogNode.close()
		>
			<button
				className={styles.closeButton}
				aria-label="Close dialog"
				onClick={() => dialogRef.current?.close()}
			>
				&times;
			</button>
			<div className={styles.mediaContainer}>
				{sortedMedias[imgPosition].image ? (
					<img
						src={`/${sortedMedias[imgPosition].image}`}
						alt={`${sortedMedias[imgPosition].title}, closeup view`}
						className={styles.media}
					/>
				) : (
					<video
						src={`/${sortedMedias[imgPosition].video}`}
						className={styles.media}
						muted // obligatoire pour autoplay sans interaction utilisateur (politique des navigateurs)
						autoPlay
						loop
						playsInline // évite le fullscreen forcé sur iOS Safari
						aria-label={`${sortedMedias[imgPosition].title}, closeup view`}
					/>
				)}
			</div>

			<button
				className={styles.prevButton}
				aria-label="Previous media"
				onClick={onPrevious}
			>
				&#10094;
			</button>

			<button
				className={styles.nextButton}
				aria-label="Next media"
				onClick={onNext}
			>
				&#10095;
			</button>

			<p className={styles.title}>{sortedMedias[imgPosition].title}</p>
		</dialog>
	);
}
