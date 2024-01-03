"use server"
import { OAuth2Client } from 'google-auth-library'

const isDev = process.env.NODE_ENV === 'development'

const client = new OAuth2Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: isDev ? 'http://localhost:3001/auth' : 'https://alfridajonathan.se/auth'
})

client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

export async function refreshAccessToken() {
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

export const getAuthUrl = () => {
    const scopes = [
        'https://www.googleapis.com/auth/photoslibrary'
    ]

    return client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    })
}

export const getRefreshToken = async (code: string) => {
    const { tokens } = await client.getToken(code)
    const refreshToken = tokens.refresh_token
    return refreshToken
}