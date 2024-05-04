import { auth } from "@/auth";
import db from "@/db/prisma";
import { Session } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { listingId: string } }) {

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
            role: true,
            emailVerified: true,
            favouriteIds: {
                where: {
                    asignedBy: session.user?.id as string
                }
            },
            listings: {
                where: {
                    asignedBy: session.user?.id as string
                }
            }
        }
    });


    return NextResponse.json(currentUser);
}