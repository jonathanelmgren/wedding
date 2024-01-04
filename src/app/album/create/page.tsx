import { refreshAccessToken } from "@/utils/googleAuth"
import { notFound } from "next/navigation"

const Page = async ({ searchParams }: { searchParams: { album: string } }) => {
    if (!searchParams.album) notFound()
    const body = {
        album: {
            title: searchParams.album
        }
    }
    const token = await refreshAccessToken()
    const res = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })
    const json = await res.json()
    console.log(json)
    return (
        <div className="relative min-h-screen">
            {JSON.stringify(json)}
        </div>
    )
}

export default Page
