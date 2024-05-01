'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { Card, CardContent } from "@/components/ui/card"
import CategoryBox from "./category-box"
import { usePathname, useSearchParams } from "next/navigation";

export const category = [
    'Sanchaung',
    'Latha',
    'Hlaing',
    'Kamayut',
    'Kyimyintaing',
    'MayanGone',
    'Botahtaung',
    'Tamwe',
    'Alone',
    'Thanlyin',
    'ThakayTa',
    'DawBon',
    'South Okkala'
]


function Category() {
    const params = useSearchParams();
    const currentCategory = params.get('category')
    const pathname = usePathname();
    return (
        <div className="flex items-center gap-2 w-[90vw] md:w-auto justify-between overflow-x-scroll no-scrollbar">

            {category.map((item) => <CategoryBox selected={currentCategory === item} key={item} name={item} />
            )}
        </div>
    )
}

export default Category