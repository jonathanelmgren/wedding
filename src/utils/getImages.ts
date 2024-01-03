import { Image } from "ts/types"

export const getImages = async () => {
    const res = await fetch('https://photos.app.goo.gl/FhTm18XnqaCkJeoj6')
    if (res.ok) {
        const html = await res.text()
        const images = await extractAndModifyImageURLs(html)
        return images
    }
    return [];
}


const regex = /\["(https:\/\/[^"]+)",(\d+),(\d+)[^\]]*]/g;
const THUMBNAIL_WIDTH = 600;
const BLUR_WIDTH = 20;
async function extractAndModifyImageURLs(html: string): Promise<Image[]> {
    let extractedData: Image[] = [];

    // Find matches and extract data
    let match;
    while ((match = regex.exec(html)) !== null) {
        const url = match[1];
        const fullWidth = parseInt(match[2]);
        const fullHeight = parseInt(match[3]);

        const aspectRatio = fullWidth / fullHeight;
        const thumbnailHeight = Math.round(THUMBNAIL_WIDTH / aspectRatio);
        const blurHeight = Math.round(BLUR_WIDTH / aspectRatio);

        const thumbnailURL = `${url}=w${THUMBNAIL_WIDTH}-h${thumbnailHeight}-no`;
        const fullURL = `${url}=w${fullWidth}-h${fullHeight}-no`;
        const blurURL = `${url}=w${BLUR_WIDTH}-h${blurHeight}-no`;

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
            },
            blur: {
                src: blurURL,
                width: BLUR_WIDTH,
                height: blurHeight
            }
        });
    }
    return extractedData;
}

