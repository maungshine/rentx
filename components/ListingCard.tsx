'use client';
import { hasFavourated } from "@/actions/favouriteActions";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { FaBath, FaBed, FaMapMarker, FaParking } from "react-icons/fa";
import HeartButton from "./heart-button";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { CurrentUser } from "@/lib/form-schema";
import { Skeleton, Spinner } from "@nextui-org/react";
import { UserWithListing } from "@/lib/helper";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

interface ListingCardProps {
    currentUser: UserWithListing | null;
    listingId: string;
    title?: string;
    type?: string;
    price: number;
    location: {
        street: string;
        ward: string;
        township: string;
        city: string;
        num: string;
    } | null,
    amenties: {
        bedroom: number;
        bath: number;
        parking: boolean;
    } | null,
    availability?: boolean;
    images: { url: string; img_key: string; }[];
    horizontal?: boolean;

}

export async function ListingCard({ currentUser, listingId, title, type, location, amenties, availability, images, price, horizontal = false }: ListingCardProps) {
    const myListing = currentUser?.listings.filter((l) => l.listingId === listingId).length !== 0;
    const pathname = usePathname();

    return (

        <Card className={`border col-span-1 cursor-pointer group h-full${horizontal ? ' flex flex-row max-w-[800px] w-full mx-auto' : ''}`}>


            <CardContent className={`p-0 md:h-[160px] h-[240px] w-full relative overflow-hidden${horizontal ? ' aspect-square rounded-none w-[240px]' : ' rounded-t-xl'}`}>
                <Image fill src={images[0].url} className={`h-full w-full object-cover group-hover:scale-110 transition${horizontal ? ' rounded-none' : ' rounded-t-xl group-hover:rounded-t-xl'}`} alt={title || 'property image'} />
                <div className="absolute top-3 right-3">
                    <Suspense fallback={<Spinner />}>

                        <HeartButton listingId={listingId} />
                    </Suspense>
                </div>
            </CardContent>
            <Link href={`/listing/${listingId}`} key={listingId} className={horizontal ? 'flex items-center relative w-full' : ''}>
                {myListing && pathname === '/my-listing' && <Link href={`/listing/${listingId}/edit`} className="absolute top-4 right-4 hover:border-b-2 border-neutral-800">Edit</Link>}
                <CardFooter className={`flex flex-col items-start p-2 gap-1 justify-between${horizontal ? '' : ''}`}>
                    <p className="font-semibold mb-2">${price}/mo</p>
                    <div className="flex gap-1 flex-wrap">
                        {amenties?.bedroom && (
                            <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg px-2 py-1 text-neutral-600">
                                <FaBed className="" /> <span className="text-nowrap">{amenties.bedroom} bd</span>
                            </span>
                        )}
                        {amenties?.bath && (
                            <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg px-2 py-1 text-neutral-600">
                                <FaBath className="" /> <span className="text-nowrap">{amenties.bath} ba</span>
                            </span>
                        )}
                        {amenties?.parking && (
                            <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg px-2 py-1 text-neutral-600">
                                <FaParking className="" /> <span className="text-nowrap">{amenties.parking ? 'Available' : 'Unavailable'}</span>
                            </span>
                        )}
                    </div>

                    <div className="flex mt-1 gap-2 align-items-center text-neutral-600">
                        <FaMapMarker />
                        <p>{location?.street && location.street} ,{location?.ward && location.ward},{location?.township && location.township} ,{location?.city && location.city}</p>
                    </div>
                </CardFooter>
            </Link>

        </Card>
    )
}
