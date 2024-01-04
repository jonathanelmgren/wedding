import { PaginatedImages } from "@/components/PaginatedImages"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import { FileUploadForm } from "./FileUploadForm"

const Page = () => {
    const cookieStore = cookies()
    const tokenCookie = cookieStore.get('token')
    if (!tokenCookie) {
        redirect('/login')
    }

    const user = cookieStore.get('user')?.value

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: 'url("/images/clouds.png")' }}></div>

            <h1 className="text-center text-8xl text-primary mt-20">Album</h1>
            <p className="text-center">Om ni vill ta bort en bild, eller vill ha en bild med orginalkvalité så kontakta Jonathan</p>
            <FileUploadForm />
            <div className="z-0 mx-auto w-full flex flex-col items-center gap-8 m-12 ">
                <PaginatedImages user={user} />
            </div>
        </div>
    )
}

export default Page
