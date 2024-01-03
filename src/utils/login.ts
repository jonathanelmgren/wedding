"use server"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import data from 'users.json';

export const login = (formData: FormData) => {
    const cookiesStorage = cookies();

    const token = formData.get('token')?.toString()
    if (!token) throw new Error('No token provided');

    const users: Record<string, string> = data

    if (!isValidToken(token)) throw new Error('Invalid token')

    const username = Object.keys(users).find((key) => users[key] === token)
    if (!username) throw new Error('Invalid token')

    cookiesStorage.set({
        name: 'token',
        value: token,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: true
    })
    cookiesStorage.set({
        name: 'user',
        value: username,
        httpOnly: false,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })
    redirect('/album')
}

export const isValidToken = (token: string) => {
    const users: Record<string, string> = data
    return Object.values(users).includes(token)
}