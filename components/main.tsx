
import { getAllListing } from '@/lib/query-listing';
import React, { useState } from 'react'
import HomepageListings from './homepage-listing';
import FilterButton from './filter-button';
import { ListingType } from './listing-page-card';
import Category, { category } from './category';
import Search from './search';
import { getCurrentUser } from '@/lib/helper';
import { CurrentUser } from '@/lib/form-schema';
import { SearchParamsType, filterListing } from '@/actions/listingActions';

async function Main({ searchParams }: { searchParams: SearchParamsType }) {
    const allListing = await filterListing(searchParams);
    const currentUser = await getCurrentUser();

    return (

        <HomepageListings allListing={allListing as ListingType[]} currentUser={currentUser as CurrentUser} />

    )
}

export default Main