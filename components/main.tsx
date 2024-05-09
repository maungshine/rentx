

import HomepageListings from './homepage-listing';
import { ListingType } from './listing-page-card';
import { UserWithListing, getCurrentUser } from '@/lib/helper';
import { SearchParamsType, filterListing } from '@/actions/listingActions';
import { ListingCardJSX } from './load-more';

async function Main({ searchParams }: { searchParams: SearchParamsType }) {
    const page = 0;
    const allListing = await filterListing(searchParams, page);
    const currentUser = await getCurrentUser();

    return (

        <HomepageListings allListing={allListing as ListingCardJSX[]} currentUser={currentUser as UserWithListing} />

    )
}

export default Main