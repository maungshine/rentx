'use client';
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { Button } from "./ui/button";
import { favourite, hasFavourated } from "@/actions/favouriteActions";
import toast from "react-hot-toast";
import { Input } from "@nextui-org/input";

interface HeartButtonProps {
    listingId: string;
}

function HeartButton({ listingId }: HeartButtonProps) {
    const [favourited, setFavourited] = useState(false);

    useEffect(() => {
        fetch(`/api/listing/${listingId}/hasFavourited`)
            .then(data => data.json())
            .then(res => setFavourited(res))
    }, [])

    async function clientAction(formData: FormData) {
        const result = await favourite(formData);

        if (result.errors.message) {
            toast.error(result.errors.message)
            return
        }
        setFavourited(prev => !prev);
    }

    return (
        <form
            action={clientAction}
        >
            <Input name='listing_id' value={listingId} className='hidden' />
            <button
                type="submit"
                className="relative
                hover:opacity-80
                hover:bg-transparant
                transition
                cursor-pointer
                p-0
                bg-transparant
                border-0
                "
            >

                <AiOutlineHeart
                    size={28}
                    className="fill-white absolute -top-[2px] -right-[2px]"
                />

                <AiFillHeart
                    size={24}
                    className={favourited ? 'fill-rose-500' : 'fill-white/60'}
                />
            </button>
        </form>
    )
}

export default HeartButton