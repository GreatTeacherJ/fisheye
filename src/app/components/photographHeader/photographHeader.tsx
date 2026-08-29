"use client";

import styles from "./photographHeader.module.css";
import ContactModal from "../ContactModal/ContactModal";
import { useState } from "react";

interface Photographer {
	name: string;
	city: string;
	country: string;
	tagline: string;
	portrait: string;
	id: number;
	price: number;
}

interface PhotographerProps {
	photographer: Photographer;
}

export default function PhotographHeader({ photographer }: PhotographerProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	function onOpen() {
		setIsModalOpen(true);
	}

	return (
		<>
			<section className={styles.photographerHeader}>
				<div className={styles.infos}>
					{/* #2 - Header h1 statique */}
					<h1 className={styles.name}>{photographer.name}</h1>

					{/* #3 - Texte statique (localisation + tagline) */}
					<p className={styles.location}>
						{photographer.city} , {photographer.country}
					</p>
					<p className={styles.tagline}>{photographer.tagline}</p>
				</div>

				{/* #4 - Bouton, ouvre la fenêtre de contact */}
				<button
					type="button"
					className={styles.contactButton}
					aria-label="Contact Me"
					onClick={onOpen}
				>
					Contactez-moi
				</button>

				{/* #5 - Image statique, alt = nom ou vide si décoratif */}
				<img
					src={photographer.portrait}
					alt={photographer.name}
					className={styles.portrait}
				/>
			</section>
			{isModalOpen && (
				<ContactModal
					photographerName={photographer.name}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</>
	);
}
