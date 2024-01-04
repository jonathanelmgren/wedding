"use client"

import { useRouter } from "next/navigation"

export const ContinueButton = ({ lastVisibleImage }: { lastVisibleImage: string }) => {
    const router = useRouter()

    const handleClick = () => {
        const el = document.getElementById(lastVisibleImage)
        el?.scrollIntoView({ behavior: 'smooth' })
    }
    return (
        <button onClick={handleClick} className="border-primary px-4 py-2 border-2">Fortsätt där du slutade</button>
    )
}
