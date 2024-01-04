import { AutoScrollButton } from "@/components/AutoScrollButton"
import ScrollToTopButton from "@/components/ScrollToTopButton"
import { ServerSideImages } from "@/components/ServerSideImages"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { FileUploadForm } from "./FileUploadForm"

const Page = () => {
    const cookieStore = cookies()
    const tokenCookie = cookieStore.get('token')
    const galleryStateCookie = cookieStore.get('galleryStates')
    const galleryState: {
        lastVisible?: string
        page?: string
    } = galleryStateCookie?.value ? JSON.parse(galleryStateCookie?.value) : { lastVisible: undefined, page: undefined }

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

            <div className="mx-2">
                <h1 className="text-center text-8xl text-primary mt-20">Album</h1>
                <p className="text-center">Om ni vill ta bort en bild, eller vill ha en bild med orginalkvalité så kontakta Jonathan</p>
                <FileUploadForm user={user} />
                <div className="z-0 mx-auto w-full flex flex-col items-center gap-8 m-12 max-w-[600px] scroll-smooth">
                    <AutoScrollButton />
                    <Suspense fallback={<>loading..</>}>
                        <ServerSideImages user={user} page={galleryState.page || '1'} lastVisibleImage={galleryState.lastVisible} />
                    </Suspense>
                </div>
            </div>
            <ScrollToTopButton />
        </div>
    )
}

export default Page
