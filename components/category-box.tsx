'use client';
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import qs from 'query-string';
import { category } from "./category";

interface CategoryBoxProps {
    name: string;
    selected?: boolean;
}
function CategoryBox({ name, selected }: CategoryBoxProps) {
    const router = useRouter();
    const params = useSearchParams();
    const handleClick = useCallback(() => {
        let query = {};

        if (params) {
            query = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...query,
            category: name
        }

        if (params?.get('category') === name) {
            delete updatedQuery.category;
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true })

        router.push(url)
    }, [name, router, params])
    return (
        <div className="bg-slate-100 flex-1 rounded-xl px-[1px] py-[1px] w-full md:w-auto">
            <div
                onClick={handleClick}
                className={`flex flex-col rounded-xl items-center justify-center gap-2 p-3 w-full md:w-auto border-b-2 hover:text-neutral-800 hover:border-b-neutral-800 transition cursor-pointer bg-white/60 backdrop-filter backdrop-blur-md flex-1 ${selected ? 'border-b-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500'}`}
            >
                <div className="font-medium text-sm text-nowrap">
                    {name}
                </div>
            </div>
        </div>

    )
}

export default CategoryBox;