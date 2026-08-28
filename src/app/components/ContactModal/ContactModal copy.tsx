"use client";

import { useState, useEffect, type SubmitEvent } from "react";
import styles from "./ContactModal.module.css";

// Props: on a besoin du nom du photographe pour le titre de la modale

interface ContactModalProps {
	photographerName: string;
	onClose: () => void; // fonction fournie par le parent, la modale ne fait qu'appeler
}

export default function ContactModal({ photographerName, onClose }: ContactModalProps) {
	// fermeture au clavier (Echap) — comme demandé plus tôt dans la conversation
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				onClose();
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	// Champs du formulaire contrôlés séparément (plus simple à lire/débugger
	// qu'un seul objet state ici, vu qu'il n'y a que 4 champs)
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault(); // empêche le rechargement de la page

		console.log({
			firstName,
			lastName,
			email,
			message,
		});

		// Réinitialisation du formulaire et fermeture après envoi
		setFirstName("");
		setLastName("");
		setEmail("");
		setMessage("");
	}

	return (
		<>
			// role="dialog" + aria-modal pour l'accessibilité : // signale aux lecteurs
			d'écran qu'il s'agit d'une modale
			<div className={styles.modal} role="dialog" aria-modal="true">
				<div className={styles.modalContent}>
					<div className={styles.modalHeader}>
						<h2>
							Contactez-moi
							<br />
							{photographerName}
						</h2>
						<button
							className={styles.closeButton}
							onClick={() => onClose()}
							aria-label="Fermer la fenêtre de contact"
						>
							&times;
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<div className={styles.formGroup}>
							<label htmlFor="first-name">Prénom</label>
							<input
								id="first-name"
								type="text"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="last-name">Nom</label>
							<input
								id="last-name"
								type="text"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="email">Email</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="message">Votre message</label>
							<textarea
								id="message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>
						</div>

						<button type="submit" className={styles.submitButton}>
							Envoyer
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
