'use client'
import { uploadImages } from '@/utils/uploadImages';
import { useFormState, useFormStatus } from 'react-dom';

const handleFormAction = async (_prevState: any, formData: FormData) => {
    return false
    return await uploadImages(formData)
}

export const FormSubmitButton = () => {
    const { pending } = useFormStatus();
    const [state, formAction] = useFormState(handleFormAction, undefined);

    return (
        <div className='flex flex-col gap-4 items-center justify-center'>
            <button formAction={formAction} className="text-center bg-primary px-4 py-2 text-white">{pending ? 'Laddar upp...' : 'Skicka'}</button>
            {state === true && <p className='text-center'>Tack! Filerna har laddats upp</p>}
            {state === false && <p className='text-center'>Något gick fel. Skicka gärna bilderna till <a className='text-primary' href='mailto:elmgren.jonathan@gmail.com'>elmgren.jonathan@gmail.com</a></p>}
        </div>
    )
}
