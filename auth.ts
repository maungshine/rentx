import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./db/prisma";


export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXT_PUBLIC_SECRET,
    ...authConfig,

})

