import { PaginatedImages } from "@/components/PaginatedImages"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"

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
        <div className="relative">
            <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: 'url("/images/clouds.png")' }}></div>
            <div className="z-0 mx-auto w-full flex flex-col items-center gap-8 m-12 ">
                <PaginatedImages user={user} />
            </div>
        </div>
    )
}

export default Page
