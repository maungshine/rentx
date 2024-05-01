import NextAuth from "next-auth";
import { authConfig } from "./auth.config";


export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXT_PUBLIC_SECRET,
    ...authConfig,

})