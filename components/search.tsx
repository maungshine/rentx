'use client';
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "./search-icon";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchParamsType } from "@/actions/listingActions";


export default function Search({ classnames }: { classnames?: string }) {
    const searchParams = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter()
    const [search, setSearch] = useState<string>('')

    function getQuery(): SearchParamsType {
        const params = new URLSearchParams(searchParams.toString());
        let query: { query: string } | {} = {};
        //@ts-ignore
        for (const [key, value] of params.entries()) {
            //@ts-ignore
            query[key] = `${value}`;
        }

        return query
    }

    const query = getQuery();


    function getUrl(query: SearchParamsType) {
        if (Object.keys(query).length === 0) {

            return '/'
        }

        let url: string = '/?';
        //@ts-ignore
        for (const [key, value] of Object.entries(query)) {
            if (url === '/?') {
                url = url + key + '=' + value;
            } else {
                url = url + '&' + key + '=' + value;

            }
        }

        return url

    }

    useEffect(() => {

        let query = getQuery();
        let url: string = '';
        //check if the query is present in url params
        const hasQuery = Object.keys(query).includes('query');

        const emptySearchBox = search.trim() === ' ' || search.trim() === ''

        if (emptySearchBox && hasQuery) {
            delete query.query
            url = getUrl(query);
            window.history.pushState(null, '', url);
            return
        } else if (emptySearchBox && !hasQuery) {
            url = getUrl(query);
            window.history.pushState(null, '', url);
            return
        }

        query['query'] = search;
        url = getUrl(query);
        window.history.pushState(null, '', url);



    }, [search])

    return (
        <Input

            radius="lg"
            onChange={(e) => setSearch(e.target.value)}
            value={search}

            classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                    "bg-transparent",
                    "text-black/90 dark:text-white/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    'w-full',
                    `${classnames}`
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                    "shadow-xl",
                    "bg-default-200/50",
                    "dark:bg-default/60",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
                    "pr-0"
                ],
            }}
            placeholder="Type to search..."
            startContent={
                <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            endContent={
                <Button type="button" onClick={(e) => {
                    const url = getUrl(getQuery())

                    router.push(url);

                }} className="text-black/50 mb-0.5 bg-white/60 cursor-pointer rounded-2xl dark:text-white/90 backdrop-blur-lg flex-shrink-0 hover:text-neutral-800 hover:border-neutral-800 hover:border hover:bg-white/700" >Search</Button>
            }
        />

    );
}
