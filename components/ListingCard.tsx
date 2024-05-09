'use client';
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { FaBath, FaBed, FaMapMarker, FaParking } from "react-icons/fa";
import HeartButton from "./heart-button";
import Link from "next/link";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import { UserWithListing } from "@/lib/helper";
import { usePathname } from "next/navigation";
import { MotionDiv } from "./motion-div";

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
    index?: number;

}

const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
}

export function ListingCard({ index, currentUser, listingId, title, type, location, amenties, availability, images, price, horizontal = false }: ListingCardProps) {
    const myListing = currentUser?.listings.filter((l) => l.listingId === listingId).length !== 0;
    const pathname = usePathname();

    return (

        <MotionDiv
            variants={variants}
            initial='hidden'
            animate='visible'
            transition={{
                delay: index ? index * 0.25 : 0.25,
                ease: 'easeInOut',
                duration: 0.5,
            }}
            viewport={{ amount: 0 }}
        >
            <Card className={`border col-span-1 cursor-pointer group h-full${horizontal ? ' flex flex-row max-w-[800px] grow-0 w-full mx-auto' : ''}`}>


                <CardContent className={`p-0 relative overflow-hidden${horizontal ? ' w-[180px] rounded-none h-[160px]' : ' rounded-t-xl md:h-[160px] h-[240px] w-full'}`}>
                    <Image fill src={images[0].url} className={`h-full w-full object-cover group-hover:scale-110 transition${horizontal ? ' rounded-none' : ' rounded-t-xl group-hover:rounded-t-xl'}`} alt={title || 'property image'} />
                    <div className="absolute top-3 right-3">


                        <HeartButton currentUser={currentUser} listingId={listingId} />

                    </div>
                </CardContent>
                <Link href={`/listing/${listingId}`} key={listingId} className={horizontal ? 'flex items-center relative w-full' : ''}>
                    {myListing && pathname === '/listing/my-listing' && <Link href={`/listing/${listingId}/edit`} className="absolute top-4 right-4 hover:border-b-2 border-neutral-800">Edit</Link>}
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
        </MotionDiv>
    )
}
