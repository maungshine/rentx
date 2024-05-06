'use server';
import db from '@/db/prisma';
import { generateVerificationCode, getCurrentUser, sendVerificationEmail } from '@/lib/helper';
import { getSession } from 'next-auth/react';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod'

const SaveInfoSchema = z.object({
    name: z.string(),
    email: z.string().email({ message: 'Email must be a valid type!' })
})

type SaveInfoReturn = { error: string } | { success: string } | { warning: string }

export const uploadProfile = async (image: { url: string, img_key: string }) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { error: 'Failed to upload, No user found', success: '' }
        }
        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                profileImageUrl: image.url,
                profileImageKey: image.img_key,
            }
        })



    } catch (error) {
        console.log(error);
        return { error: 'Failed to upload. Exception Error', success: '' }
    }

    return { error: '', success: 'Profile Uploaded' }
}

export const saveInfo = async (name: string, email: string): Promise<SaveInfoReturn> => {
    const result = SaveInfoSchema.safeParse({
        name: name,
        email: email
    })

    if (!result.success) {
        result.error.issues
        return { error: 'Please fill in valid values' }
    }

    const currentUser = await getCurrentUser();
    if (currentUser?.email !== result.data.email) {

        try {
            const existingEmail = await db.user.findFirst({
                where: {
                    email: result.data.email,
                }
            })

            if (existingEmail) {
                return {
                    error: 'Email already exists.'
                }
            }
            await db.user.update({
                where: {
                    id: currentUser?.id
                },
                data: {
                    emailVerified: false,
                    username: result.data.name,
                    email: result.data.email,
                }
            })

            const verificationCode = await generateVerificationCode(result.data.email);

            await sendVerificationEmail(result.data.email, verificationCode);

        } catch (error) {
            console.log(error);
            return { error: 'Failed to update data.' }
        }




        return { warning: 'You will be log out in 5 minutes.Please verify your updated email. A verification email is sent to ' + result.data.email }
    }

    try {
        await db.user.update({
            where: {
                id: currentUser?.id
            },
            data: {
                username: result.data.name,
                email: result.data.email,
            }
        })
    } catch (error) {
        return { error: 'Failed to update data.' }
    }


    return { success: 'Profile Information Updated.' }
}