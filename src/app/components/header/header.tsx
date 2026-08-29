import styles from "./header.module.css";
import Iconfisheye from "../icon/icon";
import Link from "next/link";

interface Props {
	onText: boolean;
}

export default function Header({ onText }: Props) {
	return (
		<Link href="/">
			<header className={styles.header}>
				<Iconfisheye width={200} height={50} />
				{onText ? <h1 className={styles.title}>Nos photographes</h1> : <></>}
			</header>
		</Link>
	);
}
