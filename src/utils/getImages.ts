"use server"
import { GoogleImagesResponse, WeddingImage } from 'ts/types';
import { refreshAccessToken } from './googleAuth';


export const getImages = async (paginationToken?: string): Promise<{ pagination: string, images: WeddingImage[] } | undefined> => {
    const accessToken = await refreshAccessToken()
    if (!accessToken) return;

    const res = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pageSize: 100,
            albumId: "AJlFrfE6jO76279Rk8zWTol7JALJ480J0ppT21ItC7MWA42cSAfGTAxBPIdDDEFU6g22_OIQEsoN",
            ...paginationToken && { pageToken: paginationToken }
        }),
        next: {
            revalidate: 3600
        }
    })
    if (res.ok) {
        const json: GoogleImagesResponse = await res.json()
        const mediaItems = json.mediaItems
        return {
            pagination: json.nextPageToken,
            images: mediaItems.map((item) => {
                const { baseUrl, filename, mediaMetadata } = item
                const { width, height } = mediaMetadata
                const aspectRatio = parseFloat(width) / parseFloat(height)

                const fullSizeWidth = 1920
                const thumbnailWidth = 600

                const thumbnailHeight = Math.round(thumbnailWidth / aspectRatio)
                const fullSizeHeight = Math.round(fullSizeWidth / aspectRatio)
                return {
                    default: {
                        url: `${baseUrl}=w${fullSizeWidth}`,
                        width: fullSizeWidth,
                        height: fullSizeHeight,
                    },
                    thumbnail: {
                        url: `${baseUrl}=w${thumbnailWidth}`,
                        width: thumbnailWidth,
                        height: thumbnailHeight
                    },
                    filename
                }
            })
        }

    }
    return;
}

