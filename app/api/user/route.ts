import { auth } from "@/auth";
import db from "@/db/prisma";
import { UserWithListing, getCurrentUser } from "@/lib/helper";
import { Session } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { listingId: string } }): Promise<NextResponse<UserWithListing | null>> {

    const currentUser = await getCurrentUser();


    return NextResponse.json(currentUser);
}