import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPhotographers = () => prisma.photographer.findMany();

export const getPhotographer = (id) =>
	prisma.photographer.findUnique({
		where: { id },
	});

export const getAllMediasForPhotographer = (photographerId) =>
	prisma.media.findMany({
		where: { photographerId },
	});

export const updateNumberOfLikes = (mediaId, newNumberOfLikes) =>
	prisma.media.update({
		where: { id: mediaId },
		data: { likes: newNumberOfLikes },
	});
