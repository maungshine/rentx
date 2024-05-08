import { ListingCard } from "@/components/ListingCard"
import Container from "@/components/container";
import { getCurrentUser } from "@/lib/helper"


async function MyListings() {
    const user = await getCurrentUser();
    const listings = user?.listings
    return (
        <section className="mt-8">
            <Container classnames=" flex flex-col gap-4">
                {listings?.length !== 0 ?
                    <>
                        <h1 className="text-2xl text-center font-semibold mb-4">Your Listings</h1>
                        {listings?.map((listing) =>


                            <ListingCard
                                horizontal={true}
                                listingId={listing.listing.id}
                                amenties={listing.listing.amenties}
                                currentUser={user}
                                price={listing.listing.price}
                                images={listing.listing.images}
                                location={listing.listing.location}
                                key={listing.listingId}
                            />

                        )}
                    </>
                    :
                    <h1 className="text-center">Your Listing is empty!</h1>
                }
            </Container>
        </section>
    )
}

export default MyListings