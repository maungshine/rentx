'ues client'
import { useParams } from 'next/navigation';
import React, { Dispatch, useContext, useEffect, useState } from 'react';
import { createContext } from 'react';


export type ListingType = {
    id: string,
    title: string,
    description: string,
    township: string,
    type: string,
    price: number,
    availability: boolean,
    latitude: number,
    longitude: number,
    amenties: {
        bath: number,
        bedroom: number,
        parking: boolean
    },
    images:
    {
        url: string,
        img_key: string
    }[],
    location: {
        city: string,
        township: string,
        ward: string,
        street: string,
        num: string
    }
}

const defaultValue: ListingType = {
    id: '',
    title: '',
    description: '',
    township: '',
    type: '',
    price: 0,
    availability: false,
    latitude: 16.8409,
    longitude: 96.1737,
    amenties: {
        bath: 0,
        bedroom: 0,
        parking: false
    },
    images: [
        {
            url: '',
            img_key: ""
        }
    ],
    location: {
        city: '',
        township: '',
        ward: '',
        street: '',
        num: ''
    }
};


type ListingContextPrividerProps = {
    listing: ListingType | null,
    setListing: Dispatch<React.SetStateAction<ListingType | null>>
};

export const ListingContext = createContext<ListingContextPrividerProps | null>(null);

function ListingConextProvider({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const [listing, setListing] = useState<ListingType | null>(defaultValue)
    useEffect(() => {

        fetch(`/api/listing/${params.listingId}`)
            .then((data => data.json()))
            .then(data => {

                setListing(data);

            })

    }, []);
    return (
        <ListingContext.Provider value={{ listing, setListing }}>
            {children}
        </ListingContext.Provider>
    )
}

export function useListingContext() {
    const context = useContext(ListingContext);

    if (!context) {
        throw new Error(
            'useListingContext must be used with a ListingContextPrivider'
        );
    }
    const { listing, setListing } = context;

    if (!listing) {
        throw new Error('Listing fetch failed');
    }

    return { listing, setListing }
}

export default ListingConextProvider


