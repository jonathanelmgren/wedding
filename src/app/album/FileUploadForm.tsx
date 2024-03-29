'use client'

import { sendEventToGA } from '@/utils/sendEventToGA';
import { upload } from '@vercel/blob/client';
import { useRef, useState } from 'react';

export const FileUploadForm = ({ user }: { user: string }) => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileList | null>(null)
    const [loading, setLoading] = useState(false)
    const [stateMessage, setStateMessage] = useState<string | undefined>(undefined)
    const [currentFileIndex, setCurrentFileIndex] = useState(1)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files)
        } else {
            setFiles(null)
        }
    }
    return (
        <form onSubmit={async (event) => {
            event.preventDefault();


            const files = inputFileRef?.current?.files;

            if (!files) return;

            if (files.length === 0) return;
            setLoading(true);

            sendEventToGA('submit', 'file-upload', 'upload', user)

            let success = 0;
            let failed = 0;

            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);

                if (file) {
                    setCurrentFileIndex(i + 1);
                    try {
                        await upload(file.name, file, {
                            access: 'public',
                            handleUploadUrl: '/api/upload',
                        });
                        success++;
                    } catch (e) {
                        failed++;
                    }
                }
            }

            if (failed === 0) {
                setStateMessage(`Alla ${success} filer laddades upp!`)
            } else {
                setStateMessage(`${success} filer laddades upp men ${failed} filer misslyckades.`)
            }
            setLoading(false);
            inputFileRef?.current?.form?.reset();
        }}
            className="flex flex-col items-center justify-center w-full gap-4 mt-4">
            <label htmlFor="dropzone-file" className="px-10 py-8 relative flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center">
                        <svg className="w-8 h-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <div>
                            <p className="text-sm text-gray-500">Klicka för att ladda upp egna bilder</p>
                            <p className="text-sm text-gray-500">Du kan ladda upp flera på samma gång</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">(Syns ej i detta galleriet)</p>
                    {files && files.length > 0 &&
                        <p className="text-xs absolute right-0 bottom-2 text-gray-500">Du laddar upp {files?.length} filer</p>
                    }
                </div>
                <input ref={inputFileRef} onChange={handleFileChange} multiple id="dropzone-file" type="file" name="files" className="hidden" />
            </label>
            <div className='flex flex-col gap-4 items-center justify-center'>
                <button disabled={loading} type="submit" className="text-center bg-primary px-4 py-2 text-white">{loading ? `Laddar upp ${currentFileIndex} av ${files?.length}...` : 'Skicka'}</button>
                {stateMessage &&
                    <p>{stateMessage}</p>
                }
            </div>
        </form>
    )
}
