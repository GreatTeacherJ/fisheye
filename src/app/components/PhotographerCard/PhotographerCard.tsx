import styles from "./PhotographerCard.module.css";
import Link from "next/link";
import type { Photographer } from "@prisma/client";

export default function PhotographerCard({
	id,
	name,
	city,
	country,
	tagline,
	price,
	portrait,
}: Photographer) {
	return (
		<Link
			href={`/${name.toLowerCase().replace(/\s+/g, "")}-${id}`}
			aria-label="Photographer Link"
		>
			<article className={styles.card}>
				{/* Fake image path — replace with real asset in /public */}
				<img
					src={portrait}
					alt={`Portrait de ${name}`}
					className={styles.portrait}
				/>
				<h2 className={styles.name}>{name}</h2>
				<p className={styles.location}>
					{city}, {country}
				</p>
				<p className={styles.tagline}>{tagline}</p>
				<p className={styles.price}>{price}€/jour</p>
			</article>
		</Link>
	);
}
