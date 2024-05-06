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
    }[];
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
