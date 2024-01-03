import { PaginatedImages } from "@/components/PaginatedImages"

const Page = async () => {

    return (
        <div className="relative">
            <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: 'url("/images/clouds.png")' }}></div>
            <div className="z-0 mx-auto w-full flex flex-col items-center gap-8 m-12 ">
                <PaginatedImages />
            </div>
        </div>
    )
}

export default Page
