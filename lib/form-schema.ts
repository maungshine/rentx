import { z } from 'zod';

export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export type CurrentUser = {
    favouriteIds: {
        userId: string;
        listingId: string;
        asignedBy: string;
    }[] | null;
    listings: {
        id: string;
        price: number;
        availability: boolean;

        location: {
            street: string;
            ward: string;
            township: string;
            city: string;
            num: string;
        } | null;
        amenties: {
            bedroom: number;
            bath: number;
            parking: boolean;

        } | null;
        images: { url: string, img_key: string }[];
    }[]

} & {
    id: string;
    username: string;
    email: string;
    password: string | null;
    profileImageUrl: string | null,
    profileImageKey: string | null,
    role: string;
    emailVerified: boolean | null;

} 
