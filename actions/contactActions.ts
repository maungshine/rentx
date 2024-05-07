'use server';

import db from "@/db/prisma";
import { z } from "zod";


interface ContactFormState {
    errors: {
        email?: string[],
        name?: string[],
        subject?: string[],
        success?: string[],
        _form?: string[];
    }
}

const ContactFormSchema = z.object({
    name: z.string(),
    email: z.string().email({ message: 'Email is not valid.' }),
    subject: z.string()
})

export const contact = async (formState: ContactFormState, formData: FormData): Promise<ContactFormState> => {
    const result = ContactFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
    })

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    const { name, email, subject } = result.data

    try {
        await db.contactUs.create({
            data: {
                name,
                email,
                subject
            }
        })


    } catch (error) {
        console.log(error);
        return {
            errors: {
                _form: ['Something went wrong']
            }
        }
    }

    return {
        errors: {
            success: ['We have received your message. We will reply to you asap!']
        }
    }
}