import db from "@/db/prisma"

export const getAllListing = async (township: string | null) => {
    if (township) {
        const listings = db.listing.findMany({
            where: {
                township
            },
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
        }
        );
        return listings
    } else {

        const listings = db.listing.findMany({
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
        }
        );
        return listings
    }
}

export const getListing = async (id: string) => {
    const listing = db.listing.findFirst({
        where: {
            id
        },
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
    }
    );
    return listing
}