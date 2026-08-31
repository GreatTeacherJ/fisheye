import Header from "./components/Header/Header";
import TagPhotographer from "./components/TagPhotographer/TagPhotographer";

export default function Home() {
	return (
		<>
			<Header onText={true} />
			<TagPhotographer />
		</>
	);
}
