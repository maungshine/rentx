'use server';
import { signIn, signOut } from "@/auth";
import { z } from 'zod';
import db from "@/db/prisma";
import bcrypt from 'bcryptjs';
import { redirect } from "next/navigation";
import { loginFormSchema } from "@/lib/form-schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generatePasswordResetToken, generateVerificationCode, getVerificationTokenByToken, sendPasswordResetEmail, sendVerificationEmail } from "@/lib/helper";

const registerFormSchema = z.object({
    username: z.string().min(6).regex(/[a-z-]/, {
        message: 'Must be lowercase letters or dashes without spaces.'
    }),
    email: z.string().email(),
    password: z.string().min(8),
})

const resetPasswordFormSchema = z.object({
    token: z.string(),
    newPassword: z.string(),
    password: z.string().min(8),
})

const getPasswordResetLinkFormSchema = z.object({
    email: z.string().email().nullish(),
})


interface registerFormState {
    errors: {
        username?: string[],
        email?: string[],
        password?: string[],
        _form?: string[];
    },
    success: {
        message?: string[],
    }
}

interface getPasswordResetLinkFormState {
    errors: {
        email?: string[],
        _form?: string[];
    },
    success: {
        message?: string[],
    }
}

interface loginFormState {
    errors: {
        email?: string[],
        password?: string[],
        _form?: string[];
    }
}

interface resetPasswordFormState {
    errors: {
        newPassword?: string[],
        password?: string[],
        _form?: string[];
    },
    success: {
        message?: string[],
    }
}



export const handleGoogleSignIn = async () => {
    'use server';
    await signIn('google');
}

export const handleGoogleSignOut = async () => {
    'use server';
    await signOut();
}


export const register = async (formState: registerFormState, formData: FormData): Promise<registerFormState> => {

    const result = registerFormSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),

    })

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
            success: {}
        }
    }

    const existingEmail = await db.user.findFirst({
        where: {
            email: result.data.email,
        }
    })

    if (existingEmail) {
        return {
            errors: {
                _form: ['Email already exists!']
            },
            success: {}
        }
    }

    const existingUsername = await db.user.findFirst({
        where: {
            username: result.data.username,
        }
    })

    if (existingUsername) {
        return {
            errors: {
                _form: ['Username already exists!']
            },
            success: {}
        }
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 16)

    try {
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
                role: 'USER',
                emailVerified: false,
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            return {
                errors: {
                    _form: [error.message]
                },
                success: {}
            }
        } else {
            return {
                errors: {
                    _form: ['Failed to register!']
                },
                success: {}
            }
        }
    }

    const verificationCode = await generateVerificationCode(result.data.email);

    await sendVerificationEmail(result.data.email, verificationCode);


    return {
        errors: {},
        success: { message: ['Verification email sent!'] }
    }

}

export const login = async (formState: loginFormState, formData: FormData): Promise<loginFormState> => {

    //form validations porformed
    const result = loginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    //if validation fails return error
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const user = await db.user.findFirst({
        where: {
            email: result.data.email,
        }
    })

    if (!user) {
        return {
            errors: {
                _form: ['Email doesn\'t exist'],
            }
        }
    }

    if (!user.password) {
        return {
            errors: {
                _form: ['Please sign in with the apporiate social login.'],
            }
        }
    }
    const isPasswordCorrect = await bcrypt.compare(result.data.password, user.password);
    if (!isPasswordCorrect) {
        return {
            errors: {
                _form: ['Invalid credentials!'],
            }
        }

    }


    //if validation passess try to signin using credentials
    try {
        await signIn('credentials', {
            email: result.data.email,
            password: result.data.password,
            redirect: false,
        })

    } catch (error) {
        //if any error occur, return error;
        if (error instanceof AuthError) {
            console.log(error);
            return {
                errors: {
                    _form: ['Failed to login']
                }
            }
        } else {
            return {
                errors: {
                    _form: ['Failed to login!']
                }
            }
        }
    }

    redirect(DEFAULT_LOGIN_REDIRECT);
    return {
        errors: {}
    }
}


export const emailVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: 'Token does not exist' };
    }

    const hasExpired = new Date(existingToken.codeExpiredTime as Date) < new Date();

    if (hasExpired) {
        return { error: 'Token has expired' };
    }


    await db.user.update({
        where: {
            id: existingToken.id
        },
        data: {
            emailVerified: true,
            codeExpiredTime: null
        }
    })

    return { success: 'Email verified' }
}



export const resetPassword = async (formState: resetPasswordFormState, formData: FormData): Promise<resetPasswordFormState> => {
    const result = resetPasswordFormSchema.safeParse({
        token: formData.get('token'),
        newPassword: formData.get('newPassword'),
        password: formData.get('password'),
    });

    //if validation fails return error
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
            success: {}
        }
    }

    if (result.data.newPassword !== result.data.password) {
        return {
            errors: {
                _form: ['Password does not match!']
            },
            success: {}
        }
    }

    const resetToken = result.data.token

    const user = await db.user.findFirst({
        where: {
            resetToken,
        }
    })

    if (!user) {
        return {
            errors: {
                _form: ['Token does not exist.']
            },
            success: {}
        }
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 16)


    await db.user.update({
        where: {
            email: user.email,
        },
        data: {
            password: hashedPassword,
            resetToken: null,
        }
    })


    return {
        errors: {},
        success: { message: ['Password reset successfully. Go to Login Page'] },
    }
}



export const getResetPasswordLink = async (formState: getPasswordResetLinkFormState, formData: FormData): Promise<getPasswordResetLinkFormState> => {
    const result = getPasswordResetLinkFormSchema.safeParse({
        email: formData.get('email'),
    });

    // if validation fails return error
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
            success: {}
        }
    }

    if (!result.data.email) {
        return {
            errors: {
                _form: ['Email must be provided']
            },
            success: {}
        }
    }

    const user = await db.user.findFirst({
        where: {
            email: result.data.email
        }
    })

    if (!user) {
        return {
            errors: {
                email: ['Email does not exist.']
            },
            success: {}
        }
    }

    const token = await generatePasswordResetToken(result.data.email);

    await sendPasswordResetEmail(result.data.email, token);

    return {
        errors: {},
        success: { message: ['Password reset link sent to your inbox.'] },
    }
}