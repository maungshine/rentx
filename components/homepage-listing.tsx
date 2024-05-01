'use client';
import { ListingCard } from "./ListingCard";
import Container from "./container";
import { getAllListing } from "@/lib/query-listing";
import Link from "next/link";
import { Suspense, useState } from "react";
import SkeletonCard from "./skeleton-card";
import { ListingType } from "./listing-page-card";
import Category from "./category";
import Search from "./search";
import FilterButton from "./filter-button";

function HomepageListings({ allListing }: { allListing: ListingType[] | null }) {
    // const [filteredListing, setFilteredListing] = useState<ListingType[] | null>(allListing);
    // const filterListing = (l: ListingType[]) => {
    //     setFilteredListing(l)
    // }

    return (
        <Container>
            <section className="flex md:flex-row flex-col items-center justify-center md:justify-between gap-8 mt-8">
                <Category />
                {/* <FilterButton filteredListing={() => filterListing} /> */}
                <form className="flex md:hidden w-full">
                    <Search />
                </form>
            </section>
            <div className="gap-8 mt-24 grid grid-cols-1 sm:gird-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:gird-cols-6">
                {allListing && allListing.map((listing) => (
                    <div key={listing && listing.id}>
                        {listing &&
                            <Suspense fallback={<SkeletonCard />}>
                                <ListingCard listingId={listing.id} price={listing.price} title={listing.title} type={listing.type} location={listing.location} amenties={listing.amenties} availability={listing.availability} images={listing.images} />
                            </Suspense>
                        }
                    </div>

                ))}
            </div>
        </Container>
    )
}

export default HomepageListings