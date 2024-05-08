'use client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from "leaflet"
import { ListingType } from '../listing-page-card';
import { Card, CardBody } from '@nextui-org/react';
import { FaBath, FaBed, FaMapMarker, FaParking } from 'react-icons/fa';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';


interface SelectLocationProps {
    lat: number;
    long: number;
    allListings?: ListingType[];
    current?: ListingType | null;
}

const ICON = icon({
    iconUrl: "/marker.png",
    iconSize: [32, 32],
})

const BlueIcon = icon({
    iconUrl: '/blue-icon.png',
    iconSize: [32, 32]
})

function Map({ lat, long, allListings, current }: SelectLocationProps) {
    const listings = allListings?.filter((l) => l?.id !== current?.id);

    return (
        <MapContainer center={[lat, long]} zoom={13} scrollWheelZoom={true} className='w-full h-full z-0 relative'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker key={current?.id} icon={ICON} position={[current?.latitude as number, current?.longitude as number]} >
                <Popup className='p-0'>
                    <Link href={`/listing/${current?.id}`} >
                        <div className='h-[80px] w-[240px] p-0 bg-black rounded-none flex flex-row text-xs'>

                            <div className='h-full w-[80px] bg-white'>
                                <Image alt='property image' src={current?.images[0].url as string} height={500} width={500} className='object-cover h-full w-full rounded-none' />
                            </div>
                            <div className='flex flex-col gap-0 pl-4 bg-white flex-1'>
                                <p className="font-semibold py-0">${current?.price}/mo</p>
                                <div className="flex gap-1 flex-wrap py-0">
                                    {current?.amenties?.bedroom && (
                                        <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg p-1 text-neutral-600">
                                            <FaBed className="" /> <span className="text-nowrap">{current.amenties.bedroom}</span>
                                        </span>
                                    )}
                                    {current?.amenties?.bath && (
                                        <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg p-1 text-neutral-600">
                                            <FaBath className="" /> <span className="text-nowrap">{current.amenties.bath}</span>
                                        </span>
                                    )}
                                    {current?.amenties?.parking && (
                                        <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg p-1 text-neutral-600">
                                            <FaParking className="" /> <span className="text-nowrap">{current.amenties.parking ? <CheckCircledIcon className='text-green-400' /> : <CrossCircledIcon className='text-red-400' />}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                    </Link>

                </Popup>


            </Marker>

            {listings &&
                listings.map((listing) => (

                    <Marker key={listing?.id} icon={BlueIcon} position={[listing?.latitude as number, listing?.longitude as number]} >
                        <Popup className='p-0'>
                            <Link href={`/listing/${listing?.id}`} >
                                <div className='h-[80px] w-[240px] p-0 bg-black rounded-none flex flex-row text-xs'>

                                    <div className='h-full w-[80px] bg-white'>
                                        <Image alt='property image' src={listing?.images[0].url as string} height={500} width={500} className='object-cover h-full w-full rounded-none' />
                                    </div>
                                    <div className='flex flex-col gap-0 pl-4 bg-white flex-1'>
                                        <p className="font-semibold py-0">${listing?.price}/mo</p>
                                        <div className="flex gap-1 flex-wrap py-0">
                                            {listing?.amenties?.bedroom && (
                                                <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg p-1 text-neutral-600">
                                                    <FaBed className="" /> <span className="text-nowrap">{listing.amenties.bedroom}</span>
                                                </span>
                                            )}
                                            {listing?.amenties?.bath && (
                                                <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg p-1 text-neutral-600">
                                                    <FaBath className="" /> <span className="text-nowrap">{listing.amenties.bath}</span>
                                                </span>
                                            )}
                                            {listing?.amenties?.parking && (
                                                <span className="flex gap-1 items-center justify-start border border-slate-200 rounded-lg p-1 text-neutral-600">
                                                    <FaParking className="" /> <span className="text-nowrap">{listing.amenties.parking ? <CheckCircledIcon className='text-green-400' /> : <CrossCircledIcon className='text-red-400' />}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </Link>

                        </Popup>


                    </Marker>
                ))
            }

        </MapContainer>
    )
}

export default Map