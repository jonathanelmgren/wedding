'use client'
import { sendEventToGA } from '@/utils/sendEventToGA';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WeddingImage } from 'ts/types';
import Spinner from './Spinner';

const ImageViewer: React.FC<{ priority: boolean, img: WeddingImage, user: string, setVisibleImage: React.Dispatch<React.SetStateAction<WeddingImage | undefined>> }> = ({ img, priority, user, setVisibleImage }) => {
    const [ref, entry] = useIntersectionObserver({
        threshold: 1,
        root: null,
        rootMargin: '0px', // Reduce the bottom side of the viewport by 50%
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    const openModal = async () => {
        sendEventToGA('click', 'Image', user, img.filename);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const handleModalOnLoad = () => setModalLoading(false);
    const handleOnLoad = () => setLoading(false);

    useEffect(() => {
        if (entry?.isIntersecting) {
            setVisibleImage(img)
        }
    }, [entry, img, setVisibleImage])

    return (
        <div id={img.filename} data-file-name={img.filename} ref={ref}>
            {loading &&
                <div className='flex items-center justify-center' style={{ width: img.thumbnail.width, height: img.thumbnail.height }}>
                    <Spinner className='w-[70px] aspect-square' />
                </div>
            }
            <Image
                src={img.thumbnail.url}
                alt="Thumbnail"
                width={img.thumbnail.width}
                height={img.thumbnail.height}
                onClick={openModal}
                className='cursor-pointer'
                style={{ opacity: loading ? 0 : 1 }}
                onLoad={handleOnLoad}
                priority={priority}
            />

            {isModalOpen && (
                <div className="fixed inset-0 p-10 z-10 w-screen overflow-y-auto bg-gray-800 bg-opacity-50">
                    <span className="absolute z-20 cursor-pointer text-gray-800 right-8 top-5 text-[5rem] leading-10 h-fit" onClick={closeModal}>&times;</span>
                    <div className="relative w-full h-full">
                        {modalLoading &&
                            <div className='absolute inset-0 z-10  flex items-center justify-center'>
                                <Spinner className='w-[30vw] aspect-square' />
                            </div>
                        }
                        <Image
                            src={img.default.url}
                            alt="Full Size"
                            width={img.default.width}
                            height={img.default.height}
                            onLoad={handleModalOnLoad}
                            style={{ opacity: modalLoading ? 0 : 1, objectFit: 'contain' }}
                            onError={closeModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageViewer;
