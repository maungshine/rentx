'use server';
import { auth } from '@/auth';
import { ListingType } from '@/components/edit-listing/edit-listing-form';
import db from '@/db/prisma';
import { getCurrentUser } from '@/lib/helper';
import { error } from 'console';
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


export const filterListing = async (formData: FormData) => {
    const result = FilterListingSchema.safeParse({
        minPrice: formData.get('minPrice'),
        maxPrice: formData.get('maxPrice'),
        bath: formData.get('bath'),
        bedroom: formData.get('bedroom'),
        parking: formData.get('parking'),
        propertyType: formData.get('propertyType'),
    })

    if (!result.success) {
        console.log(result.error.issues)
        return { error: 'Something went wrong!' }
    }

    const { minPrice, maxPrice, bath, bedroom, parking, propertyType } = result.data;

    if (minPrice > maxPrice) {
        return { error: 'Max Price must be greater than Min Price' }
    }

    const filterReduce = Object.keys(result.data) as Array<keyof typeof result.data>;

    const fullPrice = +minPrice === 0 && +maxPrice === 0;

    const constructedWhere = filterReduce.reduce((aggregate, property) => {
        if (property === 'minPrice' && !fullPrice) {

            aggregate['price'] = { gt: Number(result.data[property]) };

        } else if (property === 'maxPrice' && !fullPrice) {
            if (aggregate['price']) {
                aggregate['price'] = { ...aggregate.price, lt: Number(result.data[property]) };
            } else {

                aggregate['price'] = { lt: Number(result.data[property]) };
            }

        } else if (result.data[property] && (property === 'bath' || property === 'bedroom')) {

            if (aggregate['amenties']) {

                aggregate['amenties'] = property === 'bath' ? { ...aggregate.amenties, bath: { gt: 0 } } : { ...aggregate.amenties, bedroom: { gt: 0 } };
            } else {

                aggregate['amenties'] = property === 'bath' ? { bath: { gt: 0 } } : { bedroom: { gt: 0 } };
            }

        } else if (result.data[property] && property === 'parking') {
            if (aggregate['amenties']) {
                aggregate['amenties'] = { ...aggregate.amenties, parking: true };
            } else {

                aggregate['amenties'] = { parking: true };
            }
        } else if (result.data[property] && property === 'propertyType') {
            const propertyType = result.data[property].split(',');

            aggregate['type'] = { in: propertyType }
        }

        return aggregate;

    }, {} as Record<keyof Property | 'price' | 'amenties' | 'type', {}>);

    console.log(constructedWhere);

    if (Object.keys(constructedWhere).length === 0) {

        const listings = await db.listing.findMany({
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

        return listings;
    }

    const listings = await db.listing.findMany({

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

    return listings
}