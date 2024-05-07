

import HomepageListings from './homepage-listing';
import { ListingType } from './listing-page-card';
import { UserWithListing, getCurrentUser } from '@/lib/helper';
import { SearchParamsType, filterListing } from '@/actions/listingActions';

async function Main({ searchParams }: { searchParams: SearchParamsType }) {
    const allListing = await filterListing(searchParams);
    const currentUser = await getCurrentUser();

    return (

        <HomepageListings allListing={allListing as ListingType[]} currentUser={currentUser as UserWithListing} />

    )
}

export default Main