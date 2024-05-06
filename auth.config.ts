import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db/prisma";
import bcrypt from 'bcryptjs';
import { loginFormSchema } from "./lib/form-schema";
import { PrismaAdapter } from "@auth/prisma-adapter"




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

            try {
                const user = await db.user.findFirst({
                    where: {
                        email: params.profile?.email as string
                    }
                });
                if (params.account?.provider === 'google') {


                    if (!user) {
                        const createUser = await db.user.create({
                            data: {
                                username: params.user?.name?.toLowerCase().replace(' ', '_') as string,
                                email: params.user?.email as string,
                                role: 'USER',
                            }
                        });
                    }

                }
            } catch (error) {
                return false;
            }
            return true;
        },
        async jwt({ token, user, session, trigger }) {
            if (trigger === 'update' && session?.email) {
                token.email = session.email
            }

            if (trigger === 'update' && session?.name) {
                token.name = session.name
            }

            if (trigger === 'update' && session?.expires) {
                token.expires = session.expires
            }

            if (user) {

                return {
                    ...token,

                }
            }

            return token
        },
        async session({ session, token }) {


            return {
                ...session,

            }
        }
    }
} satisfies NextAuthConfig;