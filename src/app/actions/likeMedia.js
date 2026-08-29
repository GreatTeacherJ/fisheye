"use server";

import { updateNumberOfLikes } from "@/app/lib/prisma-db";

export async function likeMedia(mediaId, newLikes) {
	return await updateNumberOfLikes(mediaId, newLikes);
}
