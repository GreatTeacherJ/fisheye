import styles from "./Header.module.css";
import Link from "next/link";

interface Props {
	onText: boolean;
}

export default function Header({ onText }: Props) {
	return (
		<Link href="/" aria-label="Allez à la page principal">
			<header className={styles.header}>
				<img src="/iconFisheye.svg" />
				{onText ? <h1 className={styles.title}>Nos photographes</h1> : <></>}
			</header>
		</Link>
	);
}
