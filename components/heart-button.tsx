'use client';
import { useCallback, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { favourite, hasFavourated } from "@/actions/favouriteActions";
import { Input } from "@nextui-org/input";
import { UserWithListing } from "@/lib/helper";


interface HeartButtonProps {
    listingId: string;
}

function HeartButton({ listingId }: HeartButtonProps) {

    const [user, setUser] = useState<UserWithListing | null>(null);
    const favourited = user ? user.favouriteIds.filter((fav) => fav.listingId === listingId).length === 1 : false;

    const getUser = useCallback(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then((data) => {
                setUser(data);
            })
    }, [])

    return (
        <form
            action={async (formData: FormData) => {
                getUser();
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
                    className={favourited ? 'fill-rose-500' : 'fill-white/60'}
                />
            </button>
        </form>
    )
}

export default HeartButton