import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db/prisma";
import bcrypt from 'bcryptjs';
import { loginFormSchema } from "./lib/form-schema";
import { getUserById } from "./lib/helper";





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
} satisfies NextAuthConfig;