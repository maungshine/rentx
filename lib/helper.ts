import { auth } from '@/auth';
import db from '@/db/prisma';
import { Favourites, Listing, User } from '@prisma/client';
import crypto from 'crypto';
import { Session } from 'next-auth';
import { Resend } from 'resend';
import { v4 as uuidv4 } from "uuid";
import { Prisma } from '@prisma/client';



const resend = new Resend(process.env.RESEND_API_KEY)

export const generateVerificationCode = async (email: string): Promise<string> => {
    //generate verification code
    const code = uuidv4();

    const verificationCodeExpireTime = new Date(new Date().getTime() + 3600 * 1000); //10 mins expire time

    //fetch the user from db and if the user exists update the code and its expiration date 
    //if something wrong return null

    const existingUser = await db.user.findFirst({
        where: {
            email,
        }
    })

    if (existingUser) {

        await db.user.update({
            where: {
                email,
            },
            data: {
                verificationCode: code,
                codeExpiredTime: verificationCodeExpireTime,
            }
        })

    }

    //return the verification code 

    return code;

}

export const generatePasswordResetToken = async (email: string): Promise<string> => {
    //generate verification code
    const token = uuidv4();

    const passwrodResetTokenExpireTime = new Date(new Date().getTime() + 3600 * 1000); //10 mins expire time

    //fetch the user from db and if the user exists update the token and its expiration date 
    const existingUser = await db.user.findFirst({
        where: {
            email,
        }
    })

    if (existingUser) {

        await db.user.update({
            where: {
                email,
            },
            data: {
                resetToken: token,
                resetTokenExpiry: passwrodResetTokenExpireTime,
            }
        })

    }

    //return the reset token 

    return token;

}


export const sendVerificationEmail = async (email: string, code: string) => {
    const confirmLink = `http://localhost:3000/email-verification?token=${code}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Sending Email Verification link',
        html: `<p>Here is the code to verify your email</p><h2>${confirmLink}</h2>`
    })
}


export const sendPasswordResetEmail = async (email: string, code: string) => {
    const confirmLink = `http://localhost:3000/password-reset?token=${code}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Sending Email Verification link',
        html: `<p>Go to this below link to reset your password</p><h2>${confirmLink}</h2>`
    })
}


export const getVerificationTokenByToken = async (verificationCode: string) => {
    const user = db.user.findFirst({
        where: {
            verificationCode,
        }
    })

    return user;
}



export type UserWithListing = Prisma.UserGetPayload<{
    select: {
        id: true,
        username: true,
        email: true,
        password: true,
        profileImageKey: true,
        profileImageUrl: true,
        role: true,
        emailVerified: true,
        favouriteIds: {
            include: {
                listing: {
                    select: {
                        amenties: {
                            select:
                            {
                                bedroom: true,
                                bath: true,
                                parking: true
                            }
                        },
                        availability: true,
                        id: true,
                        images: true,
                        location: {
                            select: {
                                city: true,
                                township: true,
                                ward: true,
                                street: true,
                                num: true,
                            }
                        },
                        price: true,


                    }
                }
            }
        },
        listings: {
            include: {
                listing: {
                    select: {
                        amenties: {
                            select:
                            {
                                bedroom: true,
                                bath: true,
                                parking: true
                            }
                        },
                        availability: true,
                        id: true,
                        images: true,
                        location: {
                            select: {
                                city: true,
                                township: true,
                                ward: true,
                                street: true,
                                num: true,
                            }
                        },
                        price: true,


                    }
                }
            }
        }
    }
}>


export const getCurrentUser = async () => {
    try {

        const session: Session | null = await auth();
        const email = session?.user?.email;
        if (!email) return null;

        const currentUser = await db.user.findFirst({
            where: {
                email,
            },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                profileImageKey: true,
                profileImageUrl: true,
                role: true,
                emailVerified: true,
                favouriteIds: {
                    where: {
                        asignedBy: session.user?.id as string
                    },

                    include: {
                        listing: {
                            select: {
                                amenties: {
                                    select:
                                    {
                                        bedroom: true,
                                        bath: true,
                                        parking: true
                                    }
                                },
                                availability: true,
                                id: true,
                                images: true,
                                location: {
                                    select: {
                                        city: true,
                                        township: true,
                                        ward: true,
                                        street: true,
                                        num: true,
                                    }
                                },
                                price: true,


                            }
                        }
                    }

                },
                listings: {
                    where: {
                        asignedBy: session.user?.id as string
                    },
                    include: {
                        listing: {
                            select: {
                                amenties: {
                                    select:
                                    {
                                        bedroom: true,
                                        bath: true,
                                        parking: true
                                    }
                                },
                                availability: true,
                                id: true,
                                images: true,
                                location: {
                                    select: {
                                        city: true,
                                        township: true,
                                        ward: true,
                                        street: true,
                                        num: true,
                                    }
                                },
                                price: true,


                            }
                        }
                    }
                }
            }
        });

        if (!currentUser) {
            return null;
        }


        return currentUser;

    } catch (error: any) {
        return null
    }
}


export const getUserByEmail = async (email: string) => {
    const user = await db.user.findFirst({
        where: {
            email,
        }
    });

    return user;

}


