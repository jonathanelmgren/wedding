'use client'
import { useNearScreenBottom } from '@/hooks/useNearScreenBottom'
import { getImages } from '@/utils/getImages'
import { useCallback, useEffect, useState } from 'react'
import { WeddingImage } from 'ts/types'
import ImageViewer from './ImageViewer/ImageViewer'
import Spinner from './ImageViewer/Spinner'

export const PaginatedImages = ({ user }: { user: string }) => {
    const [images, setImages] = useState<WeddingImage[]>([])
    const [paginationToken, setPaginationToken] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const nearBottom = useNearScreenBottom()

    const fetchImages = useCallback(async () => {
        if (!paginationToken && images.length > 0) return
        try {
            setLoading(true)
            const response = await getImages(paginationToken)
            if (response) {
                const tmpArr = [...images, ...response.images].filter((item, index, self) => index === self.findIndex((t) => t.filename === item.filename))
                setImages(tmpArr)
                setPaginationToken(response.pagination)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [paginationToken, images])

    useEffect(() => {
        if (images.length === 0) {
            fetchImages()
        }
    }, [fetchImages, images])

    useEffect(() => {
        if (nearBottom && !loading) {
            fetchImages()
        }
    }, [nearBottom, fetchImages, loading])

    return (
        <>
            {images.map((img) => <ImageViewer user={user} key={img.filename} img={img} />)}
            {loading &&
                <Spinner className='w-[10vw]' />
            }
        </>
    )
}
