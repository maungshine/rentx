import NextAuth, { DefaultSession } from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./db/prisma";
import { getUserById } from "./lib/helper";

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
        async jwt({ token, user, session, trigger, account, profile }) {

            if (!token.sub) {
                return token
            }

            const currentUser = await getUserById(token.sub);

            if (!currentUser) {
                return token
            }

            if (account?.provider === 'google') {
                token.email = profile?.email || null;
                token.name = profile?.name || null;
                token.picture = currentUser.profileImageUrl || profile?.picture;
                token.provider = account.provider
            }


            token.email = currentUser.email;
            token.name = currentUser.username;
            token.provider = account?.provider || 'credentials';
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

