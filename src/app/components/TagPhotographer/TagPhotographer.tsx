import styles from "./TagPhotographer.module.css";
import PhotographerCard from "../PhotographerCard/PhotographerCard";
import { getAllPhotographers } from "@/app/lib/prisma-db";

export default async function TagPhotographer() {
	const photographers = await getAllPhotographers();

	if (!photographers) {
		return (
			<div role="alert">
				<p>Aucun Photographes trouvés.</p>
			</div>
		);
	}

	return (
		<main className={styles.grid}>
			{photographers.map((photographer) => (
				<PhotographerCard key={photographer.name} {...photographer} />
			))}
		</main>
	);
}
