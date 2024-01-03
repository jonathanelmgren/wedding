export type Image = {
    default: ImageData
    thumbnail: ImageData
    blur: ImageData
}

export type ImageData = {
    src: string,
    width: number,
    height: number
}