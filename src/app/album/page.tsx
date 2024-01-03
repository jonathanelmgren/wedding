import ImageViewer from "@/components/ImageViewer/ImageViewer"
import { getImages } from "@/utils/getImages"

const Page = async () => {
    const images = await getImages()
    return (
        <div className="relative">
            <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: 'url("/images/clouds.png")' }}></div>
            <div className="z-0 mx-auto w-full flex flex-col items-center gap-8 m-12 ">
                {images.map((img) => <ImageViewer key={img.default.src} {...img} />)}
            </div>
        </div>
    )
}

export default Page
