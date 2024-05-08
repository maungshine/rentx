'use client';
import { ListingType } from "./listing-page-card"
import dynamic from "next/dynamic";
import SkeletonCard from "./skeleton-card";

const Map = dynamic(() => import('@/components/list-create-forms/map'), { suspense: true, loading: () => <SkeletonCard />, ssr: false });
function ListingAside({ listing, allListings }: { listing: ListingType, allListings: ListingType[] }) {

    return (

        <div className='xl:col-span-2 col-span-5 w-full xl:h-[80vh] h-[50vh]'>
            <Map current={listing?.id} allListings={allListings} lat={listing ? listing.latitude : 16.8032} long={listing ? listing.longitude : 96.892} />
        </div>

    )
}

export default ListingAside