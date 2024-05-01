'use client';
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { ListingType } from "./listing-page-card"
import { useMemo } from "react";
import dynamic from "next/dynamic";
import SkeletonCard from "./skeleton-card";

const Map = dynamic(() => import('@/components/list-create-forms/map'), { suspense: true, loading: () => <SkeletonCard />, ssr: false });
function ListingAside({ listing }: { listing: ListingType }) {

    return (
        <div className="col-span-2 flex flex-col gap-4">
            <div className='w-full md:h-[100vh] h-[50vh]'>
                <Map lat={listing ? listing.latitude : 16.8032} long={listing ? listing.longitude : 96.892} />
            </div>
        </div>
    )
}

export default ListingAside