"use client";

import { useState, useEffect, useRef, type SubmitEvent } from "react";
import styles from "./ContactModal.module.css";

interface ContactModalProps {
	photographerName: string;
	onClose: () => void;
}

export default function ContactModal({ photographerName, onClose }: ContactModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	// showModal() active nativement : focus trap, fermeture Escape,
	// aria-modal implicite, backdrop, inertie du contenu derrière
	useEffect(() => {
		const dialogNode = dialogRef.current;
		if (!dialogNode) return;

		dialogNode.showModal();

		// L'event "close" est déclenché par Escape ou dialogNode.close()
		// -> on synchronise avec l'état du parent
		function handleClose() {
			onClose();
		}
		dialogNode.addEventListener("close", handleClose);
		return () => dialogNode.removeEventListener("close", handleClose);
	}, [onClose]);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	//pour gérer les erreurs du formulaire
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		// On construit les erreurs à chaque soumission
		const newErrors: { [key: string]: string } = {};

		if (!firstName.trim()) newErrors.firstName = "Le prénom est requis";
		if (!lastName.trim()) newErrors.lastName = "Le nom est requis";
		if (!email.trim()) newErrors.email = "L'email est requis";
		if (!message.trim()) newErrors.message = "Le message est requis";
		setErrors(newErrors);

		// Si le dictionnaire d'erreurs est vide, on peut envoyer
		if (Object.keys(newErrors).length === 0) {
			// logique d'envoi ici

			console.log({
				firstName,
				lastName,
				email,
				message,
			});

			setFirstName("");
			setLastName("");
			setEmail("");
			setMessage("");

			// Fermeture propre via l'API native (déclenche l'event "close" ci-dessus)
			dialogRef.current?.close();
		}
	}

	return (
		<dialog
			ref={dialogRef}
			className={styles.modal}
			aria-label={`Contacter ${photographerName}`}
		>
			<div className={styles.modalContent}>
				<div className={styles.modalHeader}>
					<h2>
						Contactez-moi
						<br />
						{photographerName}
					</h2>
					<button
						type="button"
						className={styles.closeButton}
						onClick={() => dialogRef.current?.close()}
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
						{errors.firstName && (
							<span className={styles.error}>{errors.firstName}</span>
						)}
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="last-name">Nom</label>
						<input
							id="last-name"
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
						{errors.lastName && (
							<span className={styles.error}>{errors.lastName}</span>
						)}
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						{errors.email && (
							<span className={styles.error}>{errors.email}</span>
						)}
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="message">Votre message</label>
						<textarea
							id="message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						{errors.message && (
							<span className={styles.error}>{errors.message}</span>
						)}
					</div>

					<button type="submit" className={styles.submitButton}>
						Envoyer
					</button>
				</form>
			</div>
		</dialog>
	);
}
