import { useRef, useEffect, useState } from "react";
import styles from "./GalleryModal.module.css";
import type { Media } from "@prisma/client";

interface GalleryModalProps {
	sortedMedias: Media[];
	onClose: () => void;
}

export default function GalleryModal({ sortedMedias, onClose }: GalleryModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [imgPosition, setImgPosition] = useState<number>(0);

	function onPrevious() {
		//si la nouvelle position est inférieur au premier élément
		// alors on affiche le dérnier de la liste
		const newImgPosition = imgPosition - 1;
		const mediasLen = sortedMedias.length;

		if (newImgPosition < 0) {
			setImgPosition(mediasLen);
		} else {
			setImgPosition(newImgPosition);
		}
	}

	function onNext() {
		//si le nouvelle élément est supérieur à la longeur de la liste
		// alors on affiche le premier élément
		const newImgPosition = imgPosition + 1;
		const mediasLen = sortedMedias.length;

		if (newImgPosition >= mediasLen) {
			setImgPosition(0);
		} else {
			setImgPosition(newImgPosition);
		}
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
