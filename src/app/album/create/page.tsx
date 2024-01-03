import { refreshAccessToken } from "@/utils/googleAuth"

const Page = async () => {
    const body = {
        album: {
            title: 'wedding-guest-uploads'
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
