import { hasFavourated } from "@/actions/favouriteActions";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { listingId: string } }) {

    const res = await hasFavourated(params.listingId)

    return NextResponse.json(res);
}