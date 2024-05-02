
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { Button } from "./ui/button";
import { favourite, hasFavourated } from "@/actions/favouriteActions";
import toast from "react-hot-toast";
import { Input } from "@nextui-org/input";

interface HeartButtonProps {
    listingId: string;
    favourited: boolean
}

function HeartButton({ favourited, listingId }: HeartButtonProps) {
    return (
        <form
            action={favourite}
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