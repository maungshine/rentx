import Image from 'next/image'
import { UseFormRegister } from 'react-hook-form'
import { FormValues } from '../add-listing'

function ImageFile({ url, register }: { url: string, register: UseFormRegister<FormValues> }) {
    return (
        <Image alt='property image' {...register('images')} className="object-cover w-full h-full" src={url} width={500} height={500} />
    )
}

export default ImageFile