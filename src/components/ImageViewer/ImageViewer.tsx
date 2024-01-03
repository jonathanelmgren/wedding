'use client'
import { sendEventToGA } from '@/utils/sendEventToGA';
import Image from 'next/image';
import { useState } from 'react';
import { Image as ImageType } from 'ts/types';
import Spinner from './Spinner';

const ImageViewer = (img: ImageType) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const openModal = async () => {
        sendEventToGA('click', 'Image', 'Open', img.default.src);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const handleOnLoad = () => setLoading(false);

    return (
        <div>
            {/* Thumbnail Image */}
            <Image
                src={img.thumbnail.src}
                alt="Thumbnail"
                width={img.thumbnail.width}
                height={img.thumbnail.height}
                onClick={openModal}
                className='cursor-pointer'
            />

            {/* Modal for Full Image */}
            {isModalOpen && (
                <div className="fixed inset-0 p-10 z-10 w-screen overflow-y-auto bg-gray-800 bg-opacity-50">
                    <span className="absolute z-20 cursor-pointer text-gray-800 right-8 top-5 text-[5rem] leading-10 h-fit" onClick={closeModal}>&times;</span>
                    <div className="relative w-full h-full">
                        {loading &&
                            <div className='absolute inset-0 z-10  flex items-center justify-center'>
                                <Spinner className='w-[30vw] aspect-square' />
                            </div>
                        }
                        <Image
                            src={img.default.src}
                            alt="Full Size"
                            layout="fill"
                            objectFit="contain"
                            onLoad={handleOnLoad}
                            style={{ opacity: loading ? 0 : 1 }}
                            onError={closeModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageViewer;
