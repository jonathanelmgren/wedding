import { getAuthUrl, getRefreshToken } from "@/utils/googleAuth"
import { redirect } from "next/navigation"

const Page = async ({ searchParams }: { searchParams: { code: string } }) => {
    const url = getAuthUrl()

    if (!searchParams.code) {
        redirect(url)
    }

    const token = await getRefreshToken(searchParams.code)
    return (
        <div className="relative min-h-screen">
            {token}
        </div>
    )
}

export default Page
