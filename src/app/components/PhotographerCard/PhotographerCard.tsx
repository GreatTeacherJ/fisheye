import styles from "./PhotographerCard.module.css";
import Link from "next/link";

// Type describing the props expected for a single photographer card
interface PhotographerCardProps {
	name: string;
	city: string;
	country: string;
	tagline: string;
	price: number;
	portrait: string; // fake path, e.g. "/photographers/mimi-keel.jpg"
}

export default function PhotographerCard({
	name,
	city,
	country,
	tagline,
	price,
	portrait,
}: PhotographerCardProps) {
	return (
		<Link href={`/photographer/${12}`} aria-label="Photographer Link">
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
