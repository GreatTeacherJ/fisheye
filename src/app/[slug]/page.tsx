import styles from "./Photographer.module.css";
import { getPhotographer, getAllMediasForPhotographer } from "@/app/lib/prisma-db";
import Header from "@/app/components/Header/Header";
import { notFound } from "next/navigation";
import Gallery from "../components/Gallery/Gallery";
import PhotographHeader from "../components/PhotographHeader/PhotographHeader";

export default async function PhotographerPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	// l'id est toujours après le dernier tiret : on le récupère par regex
	const id = slug.match(/-(\d+)$/)?.[1];

	if (!id) {
		// slug malformé, pas d'id trouvable
		notFound();
	}

	const photographer = await getPhotographer(Number(id));

	if (!photographer) {
		return (
			<div role="alert">
				<p>Aucun Photographes trouvés.</p>
			</div>
		);
	}
	//Chargement des média du photgraphe
	const medias = await getAllMediasForPhotographer(Number(id));

	return (
		<div className={styles.page}>
			<Header onText={false} />

			<PhotographHeader photographer={photographer} />

			<Gallery initialMedias={medias} price={photographer.price} />
		</div>
	);
}
