import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db/prisma";
import bcrypt from 'bcryptjs';
import { loginFormSchema } from "./lib/form-schema";



export const authConfig = {
    pages: {
        signIn: '/signin',
    },
    providers: [Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
        async authorize(credentials) {
            const validateCredentials = loginFormSchema.safeParse(credentials);
            if (validateCredentials.success) {
                const { email, password } = validateCredentials.data;

                try {
                    const user = await db.user.findFirst({
                        where: {
                            email: email
                        }
                    })

                    if (!user) {
                        return null;
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password as string, user.password as string);

                    if (!isPasswordCorrect) {
                        return null;
                    }

                    if (!user?.emailVerified) {

                        return null

                    }

                    return user;
                } catch (err) {
                    console.log(err);
                    return null;
                }
            }

            return null;
        }
    })
    ],

    callbacks: {
        async signIn(params) {
            console.log(params.user, params.account, params.profile)
            if (params.account?.provider === 'google') {
                try {
                    const user = await db.user.findFirst({
                        where: {
                            email: params.profile?.email as string
                        }
                    });

                    if (!user) {
                        const createUser = await db.user.create({
                            data: {
                                username: params.user?.name?.toLowerCase().replace(' ', '_') as string,
                                email: params.user?.email as string,
                                role: 'USER',
                            }
                        });
                    }

                } catch (error) {
                    return false;
                }
            }
            return true;
        },
    }
} satisfies NextAuthConfig;