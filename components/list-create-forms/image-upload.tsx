import { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react";
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { deleteImage, getSignedURL } from "@/actions/image-uploads";
import toast from "react-hot-toast";
import { FaCross, FaTrash, FaTrashAlt, FaTruckLoading } from "react-icons/fa";
import ImageFile from "./image-file";
import { AiOutlineLoading } from "react-icons/ai";
import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { FormValues } from "../add-listing";


interface ImageUploadProps {
    imageList: File[] | [];
    setImageList: Dispatch<SetStateAction<File[] | []>>;
    fileUrl: { url: string, img_key: string }[] | [];
    setFileUrl: Dispatch<SetStateAction<{ url: string, img_key: string }[] | []>>;
    register: UseFormRegister<FormValues>;
}

function ImageUpload({ fileUrl, setFileUrl, imageList, setImageList, register }: ImageUploadProps) {
    const { onBlur, name, ref } = register('images');

    const handleDelete = async (img_key: string) => {
        const res = await deleteImage(img_key);
        if (res?.error) {
            toast.error(res.error)
            return
        }
        const newFileUrl = fileUrl.filter((file) => img_key !== file.img_key)

        setFileUrl((prev) => [...newFileUrl])
        toast.success('Deleted successfully')
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;
        const imgList: File[] = [];
        const urls: string[] = [];
        if (file !== null) {
            Array.from(file).forEach(el => {
                setImageList((prev) => [...prev, el])
                imgList.push(el)
            })

            // if (fileUrl.length > 0) {
            //     fileUrl.forEach((url) => {

            //         URL.revokeObjectURL(url);
            //     })
            // }

            // if (file.length > 0) {
            //     Array.from(file).forEach(el => {

            //         const url: string = URL.createObjectURL(el);
            //         urls.push(url);
            //         setFileUrl((prev) => [...prev, url]);
            //     })
            // } else {

            //     setFileUrl([]);
            // }


            try {

                imgList.forEach(async (img) => {

                    //fetch signdedUrl from server
                    const signedUrl = await getSignedURL();
                    if (signedUrl.failure) {

                        throw new Error('Fail to upload!')
                    }
                    const url = signedUrl.success?.url as string;

                    const response = await fetch(url, {
                        method: 'PUT',
                        body: img,
                        headers: {
                            'Content-type': img.type,
                            'Access-Control-Allow-Origin': 'http://localhost:3000',
                        }
                    })

                    setFileUrl((prev) => [...prev, { url: response.url.split('?')[0], img_key: signedUrl.success?.img_key as string }])

                })
            } catch (error) {
                console.log(error);
                toast.error("Failed to upload")
            } finally {

                e.target.files = null;
                toast.success('Upload Success!')
            }


        }
        return

    }
    return (
        <div className="grid w-full max-w-sm items-center gap-4">
            <div className="flex items-center justify-center border-2 border-slate-500 border-dotted py-10">
                <Label htmlFor="picture" className="border border-slate-400 bg-gray-100 py-2 px-2 cursor-pointer text-xs text-slate-600">Upload Images</Label>
            </div>
            <Input id="picture" multiple={true} type="file" onChange={(e) => handleUpload(e)} onBlur={onBlur} ref={ref} name={name} className="hidden" />
            <div className="h-[50vh] w-full overflow-y-auto grid grid-cols-1 gap-4">
                {fileUrl.length > 0 &&
                    <>
                        {fileUrl.map((url) =>
                            <div key={url.img_key} className="width-full h-full relative">
                                <FaTrashAlt onClick={(e) => handleDelete(url.img_key)} className="absolute top-2 right-2 text-slate-700 text-2xl cursor-pointer" />

                                <Suspense fallback={<AiOutlineLoading className="text-2xl" />}>
                                    <ImageFile register={register} url={url.url} />
                                </Suspense>
                            </div>
                        )}
                    </>
                }

            </div>

        </div>
    )
}

export default ImageUpload