import { PrismaClient } from "@prisma/client";
import photographers from "../data/photographer.json" with { type: "json" };
import medias from "../data/media.json" with { type: "json" };

const prisma = new PrismaClient();

async function main() {
	await prisma.photographer.createMany({
		data: photographers,
	});

	await prisma.media.createMany({
		data: medias, // content from ./data/media.json
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
