"use server"
import { refreshAccessToken } from './googleAuth';

export type AlbumResponse = {
    id: string,
    title: string,
    productUrl: string,
    mediaItemsCount: string,
    coverPhotoBaseUrl: string,
    coverPhotoMediaItemId: string
}[]

export const getAlbums = async (): Promise<{ albums: AlbumResponse } | undefined> => {
    const accessToken = await refreshAccessToken()
    if (!accessToken) return;

    const res = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    if (res.ok) {
        const json = await res.json()
        return json
    }
    return;
}

