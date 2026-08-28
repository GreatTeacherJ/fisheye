import styles from "./header.module.css";
import { Iconfisheye } from "../icon/icon";
import Link from "next/link";

export default function Header() {
	return (
		<Link href="/">
			<header className={styles.header}>
				<Iconfisheye width={200} height={50} />
				<h1 className={styles.title}>Nos photographes</h1>
			</header>
		</Link>
	);
}
