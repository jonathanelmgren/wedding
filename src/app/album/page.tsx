import Image from "next/image"

type Image = {
    default: ImageData
    thumbnail: ImageData
}

type ImageData = {
    src: string,
    width: number,
    height: number
}


const getImages = async () => {
    const res = await fetch('https://photos.app.goo.gl/FhTm18XnqaCkJeoj6')
    if (res.ok) {
        const html = await res.text()
        const images = extractAndModifyImageURLs(html)
        return images
    }
    return [];
}

const Page = async () => {
    const images = await getImages()
    return (
        <div className="bg-red">
            {images.map((url) => <Image alt="image" width={url.thumbnail.width} height={url.thumbnail.height} src={url.thumbnail.src} key={url.thumbnail.src} />)}
        </div>
    )
}

export default Page

const regex = /\["(https:\/\/[^"]+)",(\d+),(\d+)[^\]]*]/g;
const THUMBNAIL_WIDTH = 200;
function extractAndModifyImageURLs(html: string): Image[] {
    let extractedData: Image[] = [];

    // Find matches and extract data
    let match;
    while ((match = regex.exec(html)) !== null) {
        const url = match[1];
        const fullWidth = parseInt(match[2]);
        const fullHeight = parseInt(match[3]);

        const aspectRatio = fullWidth / fullHeight;
        const thumbnailHeight = Math.round(THUMBNAIL_WIDTH / aspectRatio);

        const thumbnailURL = `${url}=w${THUMBNAIL_WIDTH}-h${thumbnailHeight}-no`;
        const fullURL = `${url}=w${fullWidth}-h${fullHeight}-no`;

        extractedData.push({
            default: {
                src: fullURL,
                width: fullWidth,
                height: fullHeight
            },
            thumbnail: {
                src: thumbnailURL,
                width: THUMBNAIL_WIDTH,
                height: thumbnailHeight
            }
        });
    }
    return extractedData;
}