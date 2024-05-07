import NextAuth, { DefaultSession } from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./db/prisma";
import { getUserByEmail } from "./lib/helper";

declare module "next-auth" {
    interface Session {

        user: {
            role: string;
            provider: string;
        } & DefaultSession["user"]
    }
}

type ISODateString = string;


export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXT_PUBLIC_SECRET,
    ...authConfig,
    callbacks: {

        async signIn(params) {

            try {
                if (params.account?.provider === 'google') {
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
                                provider: 'google',
                            }
                        });
                    }

                }
            } catch (error) {
                console.log(error);
                return false;
            }
            return true;
        },
        async jwt({ token, account, profile, trigger }) {

            if (trigger === 'signIn') {
                token.picture = profile?.picture
            }

            if (!token.email) {
                return token
            }

            const currentUser = await getUserByEmail(token.email);
            if (!currentUser) {

                return token
            }

            if (!token.provider && currentUser.provider === 'google') {

                token.provider = currentUser.provider;

            } else if (!token.provider) {

                token.provider = 'credentials';
            }

            token.picture = currentUser.profileImageUrl || token.picture;
            token.email = currentUser.email;
            token.name = currentUser.username;
            token.role = currentUser.role;

            if (token.provider === 'credentials' && !currentUser.emailVerified) {
                token.expires = new Date(new Date().getTime() + 300 * 1000)
            }

            return {
                ...token,

            }



        },
        async session({ session, token }) {


            return {
                ...session,
                expires: token.expires as ISODateString || session.expires,
                user: {
                    ...session.user,
                    name: token.name,
                    email: token.email,
                    provider: token.provider,
                    role: token.role,
                    image: token.picture
                }
            }
        }
    }

})

