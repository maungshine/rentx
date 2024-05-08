'use server';
import db from "@/db/prisma";
import { getCurrentUser } from "@/lib/helper"
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from 'zod';

const FavouriteFormSchema = z.object({
    listing_id: z.string(),
})

export const favourite = async (formData: FormData) => {
    const result = FavouriteFormSchema.safeParse({
        listing_id: formData.get('listing_id')
    })

    if (!result.success) {
        return {
            errors: {
                message: 'Something went wrong.'
            }
        }
    }
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return {
            errors: {
                message: 'You need to log in to complete this action.'
            }
        }
    }


    try {

        const favourated = await hasFavourated(result.data.listing_id);

        if (favourated) {
            await db.favourites.delete({
                where: {
                    userId_listingId: {
                        userId: currentUser.id,
                        listingId: result.data.listing_id
                    }
                }
            })
        } else {

            const fav = await db.favourites.create({
                data: {
                    asignedBy: currentUser?.id,
                    listingId: result.data.listing_id,
                    userId: currentUser.id,
                }
            })

        }
    } catch (error) {
        console.log(error);
        return {
            errors: {
                message: 'Something went wrong'
            }
        }
    }

    // revalidateTag('AiOutlineHeart');

    return {
        errors: {}
    }
}

export const hasFavourated = async (listingId: string) => {

    const currentUser = await getCurrentUser();

    const hasFavouratedListing = await db.favourites.findMany({
        where: {
            userId: currentUser?.id,
            listingId
        }
    })

    if (hasFavouratedListing.length === 0) return false;

    return true;
}