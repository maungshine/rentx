import { getCurrentUser } from "@/lib/helper";
import { NextResponse } from "next/server";


export async function GET(request: Request) {

    const res = await getCurrentUser()

    return NextResponse.json(res);
}