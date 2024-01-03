"use server"
import { OAuth2Client } from 'google-auth-library'
import { GoogleImagesResponse, WeddingImage } from 'ts/types'

const isDev = process.env.NODE_ENV === 'development'

const client = new OAuth2Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: isDev ? 'http://localhost:3001/auth' : 'https://alfridajonathan.se/auth'
})

client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

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
                const thumbnailWidth = 600
                const thumbnailHeight = Math.round(thumbnailWidth / aspectRatio)

                const fullWidth = parseInt(width)
                const fullHeight = parseInt(height)
                return {
                    default: {
                        url: `${baseUrl}=w${fullWidth}-h${fullHeight}`,
                        width: fullWidth,
                        height: fullHeight,
                    },
                    thumbnail: {
                        url: `${baseUrl}=w${thumbnailWidth}-h${thumbnailHeight}`,
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

async function refreshAccessToken() {
    try {
        const newToken = await client.getAccessToken();
        const accessToken = newToken.token ? newToken.token : null;
        // Store this new access token or use it for your subsequent API calls
        return accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error; // Or handle the error appropriately
    }
}