
import { getAllListing } from '@/lib/query-listing';
import React, { useState } from 'react'
import HomepageListings from './homepage-listing';
import FilterButton from './filter-button';
import { ListingType } from './listing-page-card';
import Category, { category } from './category';
import Search from './search';

async function Main({ searchParams }: { searchParams: { category: string } }) {
    const allListing = await getAllListing(searchParams?.category ? searchParams.category : null);

    return (

        <HomepageListings allListing={allListing} />

    )
}

export default Main