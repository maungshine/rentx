'use server';
import { auth } from '@/auth';
import { ListingCard } from '@/components/ListingCard';
import { ListingType } from '@/components/edit-listing/edit-listing-form';
import SkeletonCard from '@/components/skeleton-card';
import db from '@/db/prisma';
import { getCurrentUser } from '@/lib/helper';
import { error } from 'console';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';
import { z } from 'zod';


const ListingFormSchema = z.object({
    township: z.string(),
    type: z.string(),
    lat: z.number(),
    long: z.number(),
    city: z.string(),
    townshipRepeat: z.string(),
    ward: z.string(),
    street: z.string(),
    num: z.string(),
    bedroom: z.number(),
    bath: z.number(),
    parking: z.boolean(),
    title: z.string(),
    description: z.string(),
    price: z.number(),
    availability: z.boolean(),
    url: z.array(z.object({
        url: z.string(),
        img_key: z.string(),
    })),

})



export type SearchParamsType = {
    category?: string,
    minPrice?: string | number,
    maxPrice?: string | number,
    bedroom?: string,
    bath?: string,
    parking?: string,
    propertyType?: string,
    query?: string,
    page?: string,
}


const FilterListingSchema = z.object({
    minPrice: z.string(),
    maxPrice: z.string(),
    bath: z.string().nullable(),
    bedroom: z.string().nullable(),
    parking: z.string().nullable(),
    propertyType: z.string()
})

interface filterItem {
    [key: string]: number;
}


type Property = {
    bedroom: string | null;
    bath: string | null;
    parking: string | null;
    minPrice: string;
    maxPrice: string;
    propertyType: string;
}

export const createListing = async (data: any) => {
    const session = await auth();
    const currentUser = await getCurrentUser();
    const result = ListingFormSchema.safeParse(data);
    if (!result.success) {
        console.log(result.error.issues);
        return { error: "Failed to create listing" }
    }

    if (!session) {
        return { error: "Please Login First" }
    }



    try {
        const listing = await db.listing.create({
            data: {
                title: result.data.title,
                description: result.data.description,
                township: result.data.township,
                availability: result.data.availability,
                price: result.data.price,
                type: result.data.type,
                amenties: {
                    create: {
                        bath: result.data.bath,
                        bedroom: result.data.bedroom,
                        parking: result.data.parking,
                    }
                },
                location: {
                    create: {
                        city: result.data.city,
                        street: result.data.street,
                        township: result.data.township,
                        ward: result.data.ward,
                        num: result.data.num,
                    }
                },
                latitude: result.data.lat,
                longitude: result.data.long,
                images: {
                    create: result.data.url
                },
                UserListings: {
                    create: {
                        asignedBy: currentUser?.username as string,
                        userId: currentUser?.id as string
                    }
                }
            }
        }
        )
    } catch (error) {
        console.log(error);
        return { error: 'Failed to create listing' }
    }

    return { success: 'Listing Created' }
}

export const saveListing = async (data: ListingType) => {
    const session = await auth();
    const currentUser = await getCurrentUser();
    const result = ListingFormSchema.safeParse(data);
    if (!result.success) {
        console.log(result.error.issues);
        return { error: "Failed to create listing" }
    }

    if (!session) {
        return { error: "Please Login First" }
    }



    try {
        const listing = await db.listing.update({
            where: {
                id: data.id
            },
            data: {
                title: result.data.title,
                description: result.data.description,
                township: result.data.township,
                availability: result.data.availability,
                price: result.data.price,
                type: result.data.type,
                amenties: {
                    update: {
                        where: {
                            listingId: data.id,
                        },
                        data: {

                            bath: result.data.bath,
                            bedroom: result.data.bedroom,
                            parking: result.data.parking,
                        }
                    }

                },
                location: {
                    update: {
                        where: {
                            listingId: data.id
                        },
                        data: {
                            city: result.data.city,
                            street: result.data.street,
                            township: result.data.township,
                            ward: result.data.ward,
                            num: result.data.num,
                        }
                    }
                },
                latitude: result.data.lat,
                longitude: result.data.long,
                images: {
                    deleteMany: {
                        listing_id: {
                            equals: data.id
                        }
                    },
                    create: result.data.url
                }
            }
        }
        )
    } catch (error) {
        console.log(error);
        return { error: 'Failed to Update listing' }
    }

    return { success: 'Listing Updated' }
}


export type q = ['minPrice', 'maxPrice', 'bedroom', 'bath', 'parking', 'propertyType', 'category', 'query']

export const filterListing = async (searchParams: SearchParamsType, page?: number) => {
    const currentUser = await getCurrentUser();
    let q: q = ['minPrice', 'maxPrice', 'bedroom', 'bath', 'parking', 'propertyType', 'category', 'query'];
    let query: SearchParamsType = {};
    console.log(searchParams);
    if (Object.keys(searchParams).length === 0) {
        const listings = await db.listing.findMany({
            take: 3,
            skip: page ? page * 3 : 0,
            include: {
                amenties: {
                    select: {
                        bath: true,
                        bedroom: true,
                        parking: true
                    }
                },
                images: {
                    select: {
                        url: true,
                        img_key: true,
                    }
                },
                location: {
                    select: {
                        city: true,
                        township: true,
                        ward: true,
                        street: true,
                        num: true,
                    }
                }
            }
        });

        return listings.map((listing, index) => (
            <div key={listing && listing.id}>
                {listing &&
                    <Suspense fallback={<SkeletonCard />}>
                        <ListingCard index={index} currentUser={currentUser} listingId={listing.id} price={listing.price} title={listing.title} type={listing.type} location={listing.location} amenties={listing.amenties} availability={listing.availability} images={listing.images} />
                    </Suspense>
                }
            </div>

        ));
    } else {

        q.forEach((value) => {

            switch (searchParams[value]) {
                case undefined:
                    if (['minPrice', 'maxPrice'].includes(value)) {
                        //@ts-ignore
                        query[value] = null
                    }
                    break;

                default:
                    //@ts-ignore
                    query[value] = searchParams[value];
            }
        })
        console.log(query)
        //@ts-ignore
        if (query.minPrice && query.maxPrice && +query.minPrice > +query.maxPrice) {
            return []
        }

        const filterReduce = Object.keys(query) as Array<keyof typeof query>;

        const fullPrice = query.minPrice === 0 && query.maxPrice === 0;

        const constructedWhere = filterReduce.reduce((aggregate, property) => {
            if (query[property] && property === 'category') {
                aggregate['township'] = { contains: query[property] }
            } else if (property === 'minPrice' && !fullPrice && query['minPrice']) {

                aggregate['price'] = { gt: Number(query[property]) };

            } else if (property === 'maxPrice' && !fullPrice && query['maxPrice']) {
                if (aggregate['price']) {
                    aggregate['price'] = { ...aggregate.price, lt: Number(query[property]) };
                } else {

                    aggregate['price'] = { lt: Number(query[property]) };
                }

            } else if (query[property] && (property === 'bath' || property === 'bedroom')) {

                if (aggregate['amenties']) {

                    aggregate['amenties'] = property === 'bath' ? { ...aggregate.amenties, bath: { gt: 0 } } : { ...aggregate.amenties, bedroom: { gt: 0 } };
                } else {

                    aggregate['amenties'] = property === 'bath' ? { bath: { gt: 0 } } : { bedroom: { gt: 0 } };
                }

            } else if (query[property] && property === 'parking') {
                if (aggregate['amenties']) {
                    aggregate['amenties'] = { ...aggregate.amenties, parking: true };
                } else {

                    aggregate['amenties'] = { parking: true };
                }
            } else if (query && query[property] && property === 'propertyType') {
                //@ts-ignore
                const propertyType = query[property].split(',');

                aggregate['type'] = { in: propertyType }
            } else if (query && query[property] && property === 'query') {
                aggregate['title'] = { contains: query[property], mode: 'insensitive' }
                aggregate['description'] = { contains: query[property], mode: 'insensitive' }
            }

            return aggregate;

        }, {} as Record<keyof Property | 'price' | 'amenties' | 'type' | 'township' | 'title' | 'description', {}>);

        console.log(constructedWhere);
        const listings = await db.listing.findMany({
            take: 3,
            skip: page ? page * 3 : 0,
            where: constructedWhere,

            include: {
                amenties: {
                    select: {
                        bath: true,
                        bedroom: true,
                        parking: true
                    }
                },
                images: {
                    select: {
                        url: true,
                        img_key: true,
                    }
                },
                location: {
                    select: {
                        city: true,
                        township: true,
                        ward: true,
                        street: true,
                        num: true,
                    }
                }
            }

        })

        return listings.map((listing, index) => (
            <div key={listing && listing.id}>
                {listing &&
                    <Suspense fallback={<SkeletonCard />}>
                        <ListingCard index={index} currentUser={currentUser} listingId={listing.id} price={listing.price} title={listing.title} type={listing.type} location={listing.location} amenties={listing.amenties} availability={listing.availability} images={listing.images} />
                    </Suspense>
                }
            </div>

        ));
    }
}