
import Container from "@/components/container";
import ListingAside from "@/components/listing-aside";
import ListingPageCard from "@/components/listing-page-card";
import { getCurrentUser } from "@/lib/helper";
import { getListing } from "@/lib/query-listing";
import { Link } from "@nextui-org/react";

async function Listing({ params }: { params: { listingId: string } }) {

    const listing = await getListing(params.listingId);
    const user = await getCurrentUser();

    return (
        <section className="mt-8">
            <Container classnames=" grid grid-cols-5 gap-8">

                <ListingPageCard listing={listing} images={listing?.images} />
                <ListingAside listing={listing} />

            </Container>


        </section>
    )
}

export default Listing