'use client';
import { Input } from "@nextui-org/input";
import dynamic from "next/dynamic";
import React, { Dispatch, SetStateAction, Suspense, use, useEffect, useMemo, useState } from "react";
import SkeletonMap from "./skeleton-map";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormValues, Names } from "../add-listing";




interface SelectLocationProps {
    location: {
        lat: number;
        long: number;
    };
    errors: FieldErrors<FormValues>;
    register: UseFormRegister<FormValues>;
    setCustomValues: (id: Names, value: any) => void;
}

function SelectLocation({ location, register, errors, setCustomValues }: SelectLocationProps) {
    const [lat, setLat] = useState(location.lat);
    const [long, setLong] = useState(location.long);

    useMemo(() => {
        if (location.lat) {
            setLat(+location.lat);

        } else {

            setLong(0);
        }
    }, [location.lat])

    useMemo(() => {
        if (location.long) {
            setLong(+location.long);

        } else {

            setLong(0);
        }
    }, [location.long])

    const Map = useMemo(() => dynamic(() => import('./map'), { suspense: true, loading: () => <SkeletonMap /> }), [location]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">

                <Input
                    type="number"
                    label='Latitude'
                    placeholder="Enter latitude position"
                    labelPlacement="inside"
                    variant="bordered"
                    isInvalid={!!errors.lat?.message}
                    errorMessage={errors.lat?.message}
                    {...register('lat', { required: 'Latitude is required' })}
                />

                <Input
                    type="number"
                    label='Longitude'
                    placeholder="Enter longitude position"
                    labelPlacement="inside"
                    variant="bordered"
                    isInvalid={!!errors.long?.message}
                    errorMessage={errors.long?.message}
                    {...register('long', { required: 'Longitude is required' })}
                />
            </div>

            <div className="mt-4 w-ful h-[50vh]">
                <Map lat={lat} long={long} />
            </div>
        </div>

    )
}

export default SelectLocation;

