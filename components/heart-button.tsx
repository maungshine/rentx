'use client';
import { Suspense, useCallback, useEffect, useOptimistic, useState } from "react";
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

    const [user, setUser] = useState<UserWithListing | null>(null);
    const favourited = user ? user.favouriteIds.filter((fav) => fav.listingId === listingId).length === 1 : false;

    const [optimistic, setOptimistic] = useOptimistic(favourited, (state, newValue: boolean) => newValue)

    useEffect(() => {

        fetch('/api/user')
            .then(res => res.json())
            .then((data) => {
                setUser(data);
            })
    }, [optimistic])

    return (
        <form
            action={async (formData: FormData) => {
                setOptimistic(!favourited);
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
                    className={optimistic ? 'fill-rose-500' : 'fill-white/60'}
                />

            </button>
        </form>
    )
}

export default HeartButton