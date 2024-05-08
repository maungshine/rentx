'use client';
import { Suspense, startTransition, useCallback, useEffect, useOptimistic, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { favourite, hasFavourated } from "@/actions/favouriteActions";
import { Input } from "@nextui-org/input";
import { UserWithListing } from "@/lib/helper";
import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";


interface HeartButtonProps {
    listingId: string;
}

function HeartButton({ listingId }: HeartButtonProps) {

    const [fav, setFav] = useState<boolean | null>(null);


    console.log('run')
    useEffect(() => {

        fetch('/api/user',
            {
                cache: 'no-cache',
                next: {
                    tags: ['HeartButton'],
                }
            })
            .then(res => res.json())
            .then((user) => {
                const favourited = user ? user.favouriteIds.filter((fav) => fav.listingId === listingId).length === 1 : false;

                setFav(favourited);
            })
    }, [fav])

    return (
        <form
            action={async (formData: FormData) => {
                setFav((prev) => !prev)
                await favourite(formData);

            }}
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
                    className={fav ? 'fill-rose-500' : 'fill-white/60'}
                />

            </button>
        </form>
    )
}

export default HeartButton