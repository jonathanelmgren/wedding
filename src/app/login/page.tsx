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
            Skriv in din token
            <form action={login} className="flex">
                <input name="token" type="text" />
                <button>OK</button>
            </form>
        </div>
    )
}

export default Page
