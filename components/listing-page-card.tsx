'use client'

import Image from "next/image";
import { Suspense, useState } from "react";
import { FaBath, FaBed, FaMapMarker, FaParking } from "react-icons/fa";
import SkeletonCard from "./skeleton-card";
import CarouselImage from "./carousel-image";


export type ListingType = ({
    location: {
        township: string;
        street: string;
        ward: string;
        city: string;
        num: string;
    } | null;
    amenties: {
        bedroom: number;
        bath: number;
        parking: boolean;
    } | null;
    images: {
        url: string;
        img_key: string;
    }[];
} & {
    id: string;
    title: string;
    description: string;
    township: string;
    type: string;
    price: number;
    availability: boolean;
    latitude: number;
    longitude: number;
}) | null

function ListingPageCard({ listing, images }: { images: { url: string, img_key: string }[] | undefined, listing: ListingType }) {
    const [selected, setSelected] = useState(images ? images[0].img_key : null);
    const [show, setShow] = useState(false);
    const [reveal, setReveal] = useState(false);

    const closeCarousel = () => {
        setShow(false)
    }



    return (
        <div className="grid md:grid-cols-5 grid-cols-1 gap-4 col-span-3">
            <CarouselImage classes={show ? ' visible' : ' hidden'} images={images} selected={selected} closeCarousel={closeCarousel} />

            <div className="md:col-span-4 col-span-5 h-[400px]">
                {images && images.map((img) => (

                    selected === img.img_key &&
                    <div key={img.img_key} className="width-full h-full">
                        <SkeletonCard classname={reveal ? ' hidden' : ' visible'} />
                        <Image src={img.url} width={500} height={500} sizes="" onClick={() => setShow(true)} onLoad={() => setReveal(true)} alt="property image" className={`w-full h-full object-fit-cover cursor-pointer ${reveal ? 'visible' : 'hidden'}`} />
                    </div>

                ))

                }
            </div>
            <div className="md:col-span-1 col-span-5 flex flex-row md:flex-col gap-4 md:overflow-y-scroll overflow-x-scroll md:h-[400px] h-[120px]">
                {images && images.map((img) => (
                    <div key={img.img_key} className={`md:w-full aspect-square w-[200px] md:h-[200px] cursor-pointer ${selected === img.img_key ? 'border-2 border-yellow-600' : ''}`}>
                        <Image src={img.url} width={500} height={500} onClick={() => setSelected(img.img_key)} alt="property image" className={`h-full w-full object-fit-cover cursor-pointer`} />
                    </div>
                ))

                }
            </div>

            <div className="col-span-5 flex flex-col gap-4">
                <h2 className="mt-4 text-semibold text-2xl text-slate-600">{listing && listing.title}</h2>
                <div className="flex">
                    <p className="text-slate-600">${listing && listing.price}</p>
                    <div className="flex mt-1 gap-2 align-items-center text-slate-400 ml-auto">
                        <FaMapMarker />
                        <p>{listing && listing.location?.street} ,{listing && listing.location?.ward},{listing && listing.location?.township} ,{listing && listing.location?.city}</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    {listing?.amenties?.bedroom && (
                        <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg px-2 py-1 text-neutral-600">
                            <FaBed className="" /> <span className="text-nowrap">{listing.amenties.bedroom} bd</span>
                        </span>
                    )}
                    {listing?.amenties?.bath && (
                        <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg px-2 py-1 text-neutral-600">
                            <FaBath className="" /> <span className="text-nowrap">{listing.amenties.bath} ba</span>
                        </span>
                    )}
                    {listing?.amenties?.parking && (
                        <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg px-2 py-1 text-neutral-600">
                            <FaParking className="" /> <span className="text-nowrap">{listing.amenties.parking ? 'Available' : 'Unavailable'}</span>
                        </span>
                    )}
                </div>
                <p>{listing && listing.description}</p>
            </div>
        </div>
    )
}

export default ListingPageCard