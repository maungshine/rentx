'use client'
import Container from "@/components/container"
import ListingContextProvider from "@/hooks/useListingContext";
import EditListingForm from "@/components/edit-listing/edit-listing-form";




function EditListing({ params }: { params: { listingId: string } }) {

    return (
        <section className="mt-4 p-8">
            <Container>
                <ListingContextProvider>
                    <EditListingForm />
                </ListingContextProvider>
            </Container>
        </section>
    )
}

export default EditListing