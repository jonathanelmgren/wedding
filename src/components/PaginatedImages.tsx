'use client'
import { getImages } from '@/utils/getImages'
import { useCallback, useEffect, useState } from 'react'
import { WeddingImage } from 'ts/types'
import ImageViewer from './ImageViewer/ImageViewer'
import Spinner from './ImageViewer/Spinner'
import { PAGE_SIZE } from './ServerSideImages'

const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const PaginatedImages = ({ user, images: initialImages, paginationToken: initialPaginationToken }: { paginationToken: string | undefined, user: string, images: WeddingImage[], page: number }) => {
    const [images, setImages] = useState<WeddingImage[]>(initialImages);
    const [paginationToken, setPaginationToken] = useState<string | undefined>(initialPaginationToken);
    const [visibleImage, setVisibleImage] = useState<WeddingImage | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const nearBottom = images[images.length - 3]?.filename === visibleImage?.filename

    useEffect(() => {
        if (visibleImage) {
            const newPage = Math.ceil(images.length / PAGE_SIZE)
            setCookie('galleryStates', JSON.stringify({ lastVisible: visibleImage.filename, page: newPage }), 1)
        }
    }, [visibleImage, images])

    const loadMoreImages = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getImages(paginationToken)
            if (res) {
                const tmpArr = [...images, ...res.images].filter((item, index, self) => index === self.findIndex((t) => t.filename === item.filename))
                setImages(tmpArr)
                setPaginationToken(res.pagination)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [images, paginationToken])

    useEffect(() => {
        if (nearBottom && !loading) {
            loadMoreImages()
        }
    }, [loadMoreImages, nearBottom, loading])

    return (
        <>
            {images.map((img) =>
                <ImageViewer priority={initialImages.findIndex(initial => initial.filename === img.filename) > -1} setVisibleImage={setVisibleImage} user={user} key={img.filename} img={img} />)}
            {loading && <Spinner className='w-[20vw]' />}
        </>
    )
}
