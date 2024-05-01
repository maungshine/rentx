import { getListing } from "@/lib/query-listing";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { listingId: string } }) {

    const listing = await getListing(params.listingId);

    return NextResponse.json(listing);
}