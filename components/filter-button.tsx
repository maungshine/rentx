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
import { Checkbox, Input, Slider } from "@nextui-org/react";
import { Card, CardContent } from "./ui/card";
import { types } from "./list-create-forms/select-type";
import CategoryInput from "./list-create-forms/category-input";
import { useState } from "react";
import toast from "react-hot-toast";
import { filterListing } from "@/actions/listingActions";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingType } from "./listing-page-card";


function FilterButton({ filteredListing }: { filteredListing: (l: ListingType[]) => void }) {
    const [selected, setSelected] = useState<string[]>([]);
    const [bedroom, setBedroom] = useState(false);
    const [bath, setBath] = useState(false);
    const [parking, setParking] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const searchParams = useSearchParams();

    const handleSubmit = async (formData: FormData) => {
        const res = await filterListing(formData);
        console.log(res);
        // if (res) {
        //     toast.error('Something went wrong. Try again later.')
        //     return
        // }

        // filteredListing(res);

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="py-[23px] rounded-xl flex gap-2 w-full md:w-auto">< FaFilter /> <span className="text-nowrap">Filter More</span></Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-scroll h-[80vh] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="p-4 text-center" >Fliter Down The Listings</DialogTitle>
                    <DialogDescription>
                        <Card>
                            <CardContent>
                                <form action={handleSubmit} className="p-4 flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <Input
                                            placeholder="Min pirce"
                                            label="Set Min Price"
                                            labelPlacement="inside"
                                            name="minPrice"
                                            variant={"bordered"}
                                            value={minPrice.toString()}
                                            onChange={(e) => {
                                                if (+e.target.value >= 0) {
                                                    setMinPrice(+e.target.value)
                                                    return
                                                }
                                                setMinPrice(0)
                                                return
                                            }
                                            }
                                        />
                                        <Input
                                            placeholder="Max pirce"
                                            label="Set Max Price"
                                            labelPlacement="inside"
                                            name="maxPrice"
                                            variant={'bordered'}
                                            value={maxPrice.toString()}
                                            onChange={(e) => {
                                                if (+e.target.value >= 0) {
                                                    setMaxPrice(+e.target.value)
                                                    return
                                                }
                                                setMaxPrice(0);
                                                return
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <Checkbox name="bedroom" value={bedroom.toString()} isSelected={bedroom} onValueChange={setBedroom}>Bedroom</Checkbox>
                                        <Checkbox name="bath" value={bath.toString()} isSelected={bath} onValueChange={setBath}>Bath</Checkbox>
                                        <Checkbox name="parking" value={parking.toString()} isSelected={parking} onValueChange={setParking}>Parking</Checkbox>
                                    </div>
                                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                                        <input type="text" value={selected} className="hidden" name="propertyType" />
                                        {types.map((item) => (
                                            <CategoryInput
                                                onClick={() => {
                                                    if (selected.includes(item)) {
                                                        const removedList = selected.filter((el) => el !== item);
                                                        setSelected(removedList);
                                                    } else {
                                                        setSelected(prev => [...prev, item]);

                                                    }
                                                }}
                                                selected={selected.includes(item)}
                                                label={item}
                                                key={item}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Button className="w-full" >Apply Filters</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>

        </Dialog>

    )
}

export default FilterButton