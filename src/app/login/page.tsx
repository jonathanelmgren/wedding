import { isValidToken, login } from "@/utils/login"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const Page = () => {
    const existingToken = cookies().get('token')?.value
    if (existingToken && isValidToken(existingToken)) {
        redirect('/album')
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <p className="mb-2">Skriv in koden som du fick på ditt kort</p>
            <form action={login} className="flex">
                <input name="token" type="text" className="rounded-r-none" />
                <button className="border-primary border-l-0 border-[1px] px-4 bg-primary text-white rounded-r-md">OK</button>
            </form>
        </div>
    )
}

export default Page
