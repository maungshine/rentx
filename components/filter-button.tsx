'use client';
import { FaFilter } from "react-icons/fa";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox, Input } from "@nextui-org/react";
import { Card, CardContent } from "./ui/card";
import { types } from "./list-create-forms/select-type";
import CategoryInput from "./list-create-forms/category-input";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { useRouter, useSearchParams } from "next/navigation";
import { ListingType } from "./listing-page-card";
import queryString from "query-string";
import { filterListing } from "@/actions/listingActions";
import { ListingCardJSX } from "./load-more";


function FilterButton({ filteredListing }: { filteredListing: (l: ListingCardJSX[]) => void }) {

    let minPriceRef = useRef<HTMLInputElement>(null);
    let maxPriceRef = useRef<HTMLInputElement>(null);
    let bedroomRef = useRef<HTMLInputElement>(null);
    let bathRef = useRef<HTMLInputElement>(null);
    let parkingRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();


    const handleSubmit = async () => {


        const params = new URLSearchParams(searchParams.toString());
        let query = {};
        let url: string = '/?';
        //@ts-ignore
        for (const [key, value] of params.entries()) {
            //@ts-ignore
            query[key] = value;
            if (url === '/?') {
                url = url + key + '=' + value;
            } else {
                url = url + '&' + key + '=' + value;

            }
        }



        try {

            const res = await filterListing(query);

            filteredListing(res);

        } catch (error) {
            toast.error('Something went wrong. Try again later.')
            return

        } finally {
            router.push(url);
        }


    }

    const getQuery = (qName: string, name: string) => {
        if (qName === name) {
            return { name: name }
        }
        return null
    }

    const handleClick = (queryName: string, value: string) => {
        let minPrice = getQuery(queryName, 'minPrice');
        let maxPrice = getQuery(queryName, 'maxPrice');
        let bedroom = getQuery(queryName, 'bedroom');
        let bath = getQuery(queryName, 'bath');
        let parking = getQuery(queryName, 'parking');
        let propertyType = getQuery(queryName, 'propertyType');

        let type = [];
        let query = {};

        if (searchParams) {
            query = queryString.parse(searchParams.toString());
        }

        let updatedQuery: any;
        if (minPrice) {
            updatedQuery = {
                ...query,
                minPrice: value
            }
        }
        if (maxPrice) {
            updatedQuery = {
                ...query,
                maxPrice: value
            }
        }
        if (bath) {
            updatedQuery = {
                ...query,
                bath: value
            }
        }
        if (bedroom) {

            updatedQuery = {
                ...query,
                bedroom: value
            }

        }
        if (parking) {
            updatedQuery = {
                ...query,
                parking: value
            }
        }
        if (propertyType) {
            //@ts-ignore
            if (query['propertyType']) {
                //@ts-ignore
                if (query['propertyType'].split(',').includes(value)) {
                    updatedQuery = {
                        ...query,
                        //@ts-ignore
                        propertyType: query['propertyType'].split(',').filter((item) => item !== value).join(',')
                    }
                } else {


                    updatedQuery = {
                        ...query,
                        //@ts-ignore
                        propertyType: query.propertyType + ',' + value
                    }
                }

            } else {
                updatedQuery = {
                    ...query,
                    propertyType: [value]
                }


            }
        }

        if (searchParams?.get(queryName) === value || (['bath', 'bedroom', 'parking'].includes(queryName) && value === 'false')) {
            delete updatedQuery[queryName];
        }

        if (minPrice && value === '') {
            delete updatedQuery[queryName];

        }

        if (maxPrice && (value === '' || Number(value) === 0)) {
            delete updatedQuery[queryName];

        }

        const url = queryString.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true })
        window.history.pushState(null, '', url)

    }

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button variant={"outline"} className="py-[23px] rounded-xl flex gap-2 w-full md:w-auto">< FaFilter /> <span className="text-nowrap">Filter More</span></Button>
            </DialogTrigger>

            <DialogContent className="overflow-y-scroll h-[80vh] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="p-4 text-center" >Fliter Down The Listings</DialogTitle>
                    <DialogDescription>
                        <Card>
                            <form action={handleSubmit} >
                                <CardContent className="p-4 flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <Input
                                            placeholder="Min pirce"
                                            label="Set Min Price"
                                            labelPlacement="inside"
                                            name="minPrice"
                                            variant={"bordered"}
                                            ref={minPriceRef}
                                            value={searchParams.get('minPrice') || ''}

                                            onChange={(e) => {

                                                if (minPriceRef.current === null) {

                                                    return
                                                }
                                                if (Number(minPriceRef.current.value) >= 0) {

                                                    handleClick('minPrice', minPriceRef.current.value)

                                                }



                                            }
                                            }
                                        />
                                        <Input
                                            placeholder="Max pirce"
                                            label="Set Max Price"
                                            labelPlacement="inside"
                                            name="maxPrice"
                                            variant={'bordered'}
                                            ref={maxPriceRef}
                                            value={searchParams.get('maxPrice') || ''}
                                            onChange={(e) => {

                                                if (maxPriceRef.current === null) {

                                                    return
                                                }
                                                if (Number(maxPriceRef.current.value) >= 0) {

                                                    handleClick('maxPrice', maxPriceRef.current.value)

                                                }



                                            }
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <Checkbox name="bedroom" value={searchParams.get('bedroom') as string} onChange={(e) => handleClick('bedroom', bedroomRef.current?.value as string)} isSelected={searchParams.get('bedroom') ? true : false} ref={bedroomRef} >Bedroom</Checkbox>
                                        <Checkbox name="bath" value={searchParams.get('bath') as string} onChange={(e) => handleClick('bath', bathRef.current?.value as string)} isSelected={searchParams.get('bath') ? true : false} ref={bathRef} >Bath</Checkbox>
                                        <Checkbox name="parking" value={searchParams.get('parking') as string} onChange={(e) => handleClick('parking', parkingRef.current?.value as string)} isSelected={searchParams.get('parking') ? true : false} ref={parkingRef} >Parking</Checkbox>
                                    </div>
                                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                                        <input type="text" value={searchParams.get('propertyType') as string} className="hidden" name="propertyType" />
                                        {types.map((item) => (
                                            <CategoryInput
                                                onClick={() => {
                                                    // if (searchParams.get('propertyType') === 'Share Room') {
                                                    //     handleClick('propertyType', 'Share_Room')
                                                    //     return
                                                    // }
                                                    handleClick('propertyType', item)

                                                }}
                                                selected={(searchParams.get('propertyType') ? searchParams.get('propertyType')?.split(',').includes(item) : false) as boolean}
                                                label={item}
                                                key={item}
                                            />
                                        ))}
                                    </div>
                                    <Button type="button" onClick={() => handleSubmit()}>Apply Filters</Button>
                                </CardContent>
                            </form>
                        </Card>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>

        </Dialog>

    )
}

export default FilterButton