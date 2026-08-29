import Header from "./components/header/header";
import TagPhotographer from "./components/TagPhotographer/TagPhotographer";

export default function Home() {
	return (
		<>
			<Header onText={true} />
			<TagPhotographer />
		</>
	);
}
