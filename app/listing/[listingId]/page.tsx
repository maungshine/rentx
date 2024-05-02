
import Container from "@/components/container";
import ListingAside from "@/components/listing-aside";
import ListingPageCard from "@/components/listing-page-card";
import { getListing } from "@/lib/query-listing";
import { Link } from "@nextui-org/react";

async function Listing({ params }: { params: { listingId: string } }) {

    const listing = await getListing(params.listingId);

    return (
        <section className="mt-8">
            <Container classnames="grid md:grid-cols-5 grid-cols-1 gap-8">
                <Link href={`/listing/${params.listingId}/edit`} className="md:col-span-5 col-span-1  ml-auto text-slate-600 mr-4" underline="hover">Edit Listing</Link>
                <ListingPageCard listing={listing} images={listing?.images} />
                <ListingAside listing={listing} />

            </Container>


        </section>
    )
}

export default Listing