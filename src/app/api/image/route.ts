import { fetchGoogleImageById } from "@/utils/getImages";
import { WeddingImage } from "ts/types";

export const revalidate = 3500

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const fullsize = url.searchParams.get("fullsize") === "true";

    if (!id) {
        return new Response("Missing id", { status: 400 });
    }

    const image: WeddingImage | undefined = await fetchGoogleImageById(id);
    if (!image) {
        return new Response("Image not found", { status: 404 });
    }

    const imageUrl = fullsize ? image.default.url : image.thumbnailDesktop.url;

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const headers = new Headers();
        headers.set("Content-Type", image.mimeType);
        headers.set("Content-Length", arrayBuffer.byteLength.toString());

        return new Response(arrayBuffer, {
            headers: headers,
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return new Response("Failed to fetch image", { status: 500 });
    }
}