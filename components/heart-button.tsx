'use client';
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { favourite } from "@/actions/favouriteActions";
import { Input } from "@nextui-org/input";
import { UserWithListing } from "@/lib/helper";


interface HeartButtonProps {
    listingId: string;
    currentUser: UserWithListing | null
}

function HeartButton({ listingId, currentUser }: HeartButtonProps) {
    const [user, setUser] = useState<UserWithListing | null>(currentUser);
    const favourited = user ? user.favouriteIds.filter((fav) => fav.listingId === listingId).length === 1 : false;
    const [fav, setFav] = useState<boolean | null>(favourited);


    useEffect(() => {
        async function getUser(): Promise<UserWithListing> {

            return fetch('/api/user',
                {
                    cache: 'no-cache',
                    next: {
                        tags: ['HeartButton'],
                    }
                })
                .then(res => res.json() as Promise<{ data: UserWithListing }>)
                .then((data) => {

                    return data.data
                })
        }

        getUser().then(user => {

            setUser(user);

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