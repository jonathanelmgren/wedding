import { getImages } from "@/utils/getImages";
import { WeddingImage } from "ts/types";
import { ContinueButton } from "./ContinueButton";
import { PaginatedImages } from "./PaginatedImages";

export const PAGE_SIZE = 100

export const ServerSideImages: React.FC<{ page: string, user: string, lastVisibleImage?: string }> = async ({ lastVisibleImage, page: pageString, user }) => {
    const page = parseInt(pageString);
    const amountsOfImages = page * PAGE_SIZE;
    let images: WeddingImage[] = [];
    let paginationToken: string | undefined = undefined;

    do {
        const imgResponse = await getImages(paginationToken)
        if (imgResponse) {
            images = [...images, ...imgResponse.images]
            paginationToken = imgResponse.pagination
        }
    } while (images.length < amountsOfImages)

    return (
        <>
            {lastVisibleImage && <ContinueButton lastVisibleImage={lastVisibleImage} />}
            <PaginatedImages paginationToken={paginationToken} images={images} user={user} page={page} />
        </>
    )
}
