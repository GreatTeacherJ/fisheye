import styles from "./photographer.module.css";
import { getPhotographer } from "@/app/lib/prisma-db";
import Link from "next/link";

const mediaSamples = [
	{
		id: 1,
		title: "Arc-en-ciel",
		image: "/images/photographers/mimi-keel/arc-en-ciel.jpg",
		likes: 11,
	},
	{
		id: 2,
		title: "Solitude",
		image: "/images/photographers/mimi-keel/solitude.jpg",
		likes: 12,
	},
	{
		id: 3,
		title: "Mariage à la mer",
		image: "/images/photographers/mimi-keel/mariage-mer.jpg",
		likes: 12,
	},
];

export default async function PhotographerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const photographer = await getPhotographer(Number(id));

	if (!photographer) {
		return (
			<div role="alert">
				<p>Aucun Photographes trouvés.</p>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			{/* #1 - Logo = lien image vers l'accueil */}
			<header className={styles.mainHeader}>
				<Link href="/" aria-label="Fisheye Home page">
					<img
						src="/images/logo.svg"
						alt="Fisheye Home page"
						width={160}
						height={40}
					/>
				</Link>
			</header>

			<section className={styles.photographerHeader}>
				<div className={styles.infos}>
					{/* #2 - Header h1 statique */}
					<h1 className={styles.name}>Mimi Keel</h1>

					{/* #3 - Texte statique (localisation + tagline) */}
					<p className={styles.location}>London, UK</p>
					<p className={styles.tagline}>Voir le beau dans le quotidien</p>
				</div>

				{/* #4 - Bouton, ouvre la fenêtre de contact */}
				<button
					type="button"
					className={styles.contactButton}
					aria-label="Contact Me"
				>
					Contactez-moi
				</button>

				{/* #5 - Image statique, alt = nom ou vide si décoratif */}
				<img
					src="/images/photographers/mimi-keel/portrait.jpg"
					alt="Mimi Keel"
					width={120}
					height={120}
					className={styles.portrait}
				/>
			</section>

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
				>
					<option value="popularity">Popularité</option>
					<option value="date">Date</option>
					<option value="title">Titre</option>
				</select>
			</section>

			<main className={styles.gallery}>
				{mediaSamples.map((media) => (
					<figure key={media.id} className={styles.card}>
						{/* #9 - Lien image, ouvre la lightbox */}
						<Link
							href={`#lightbox-${media.id}`}
							aria-label={`${media.title}, closeup view`}
						>
							<img
								src={media.image}
								alt=""
								width={300}
								height={200}
								className={styles.thumbnail}
							/>
						</Link>

						<figcaption className={styles.caption}>
							{/* #10 - Texte statique */}
							<span className={styles.title}>{media.title}</span>

							<span className={styles.likesWrapper}>
								<span className={styles.likesCount}>{media.likes}</span>
								{/* #11 - Icône image statique, alt="likes" si <img>,
                    sinon aria-label="likes" si <i>/<div> (ici <span> donc aria-label) */}
								<span
									role="img"
									aria-label="likes"
									className={styles.likeIcon}
								>
									❤️
								</span>
							</span>
						</figcaption>
					</figure>
				))}
			</main>
		</div>
	);
}
