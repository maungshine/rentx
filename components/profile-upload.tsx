'use client';

import { deleteImage, getSignedURL } from "@/actions/image-uploads";
import { uploadProfile } from "@/actions/profileActions";
import { CurrentUser } from "@/lib/form-schema";
import { Input } from "@nextui-org/input"
import { Label } from "@radix-ui/react-label"
import { Session } from "next-auth"
import Image from "next/image"
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { FaCamera, FaUserCircle } from "react-icons/fa"


function ProfileUpload({ session, currentUser }: { session: Session | null, currentUser: CurrentUser | null }) {
    const [fileUrl, setFileUrl] = useState<{ url: string, img_key: string }>({ url: currentUser?.profileImageUrl || '', img_key: currentUser?.profileImageKey || '' });

    const handleDelete = async (img_key: string) => {
        const res = await deleteImage(img_key);
        if (res?.error) {
            toast.error(res.error)
            return
        }


        setFileUrl({ url: '', img_key: '' })

        toast.success('Deleted successfully')
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files && e.target.files[0];

        if (!file) {
            toast.error('Failed to upload image')
            return
        }



        try {
            //fetch signdedUrl from server
            const signedUrl = await getSignedURL();
            if (signedUrl.failure) {

                throw new Error('Fail to upload!')
                return
            }
            const url = signedUrl.success?.url as string;

            if (fileUrl.url !== '' && fileUrl.img_key !== '') {
                handleDelete(fileUrl.img_key);
            }

            const response = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-type': file.type,
                    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://rentx-neon.vercel.app' : 'http://localhost:3000',
                }
            })
            const image = { url: response.url.split('?')[0], img_key: signedUrl.success?.img_key as string }
            console.log(image);
            const res = await uploadProfile(image);
            console.log(res);
            setFileUrl(image);


        } catch (error) {
            console.log(error);
            toast.error("Failed to upload")
            return

        }
        e.target.files = null;
        toast.success('Upload Success!')

    }

    const profileRef = useRef(null);
    return (
        <div>
            <form action="" className="hidden">
                <Input id="picture"
                    onChange={(e) =>
                        handleUpload(e)

                    }
                    ref={profileRef} type="file" className="hidden" name="profileImage" />

            </form>

            <div className="h-[120px] w-[120px] mt-4 rounded-full border-2 border-slate-600  relative">
                {fileUrl.url !== ''
                    ? <Image src={currentUser?.profileImageUrl || session?.user.image as string} width={120} height={120} className="h-full w-full rounded-full object-fit-cover" alt="user profile image" />
                    : <FaUserCircle className="h-full w-full text-neutral-500" />

                }
                <Label htmlFor="picture" className="absolute bottom-4 right-4 cursor-pointer">
                    <FaCamera className="text-black" />
                </Label>
            </div>
        </div>
    )
}

export default ProfileUpload