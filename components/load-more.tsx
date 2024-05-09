'user client';
import { useInView } from "react-intersection-observer";
import { UserWithListing } from "@/lib/helper";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { SearchParamsType, filterListing } from "@/actions/listingActions";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

let page = 1;

export type ListingCardJSX = JSX.Element;

type LoadMoreProps = {
    currentUser: UserWithListing | null,
    firstListing: ListingCardJSX[] | null,
}

function LoadMore({ currentUser, firstListing }: LoadMoreProps) {
    const { ref, inView } = useInView();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState<boolean>(true)
    const [listings, setListings] = useState<ListingCardJSX[] | []>([]);
    const [params, setParams] = useState<SearchParamsType>({})

    function convertParams(searchParams: ReadonlyURLSearchParams): SearchParamsType {
        const params = new URLSearchParams(searchParams.toString());
        let query = {};

        //@ts-ignore
        for (const [key, value] of params.entries()) {
            //@ts-ignore
            query[key] = value;
        }
        return query
    }




    useEffect(() => {
        const params = convertParams(searchParams);
        setParams(params);
        setListings([]);
        if (!firstListing) {
            setLoading(true);
        }
        page = 1
    }, [searchParams])

    useEffect(() => {
        if (inView && loading) {
            filterListing(params, page)
                .then((res) => {
                    console.log(res)
                    if (res.length === 0) {
                        setLoading(false)
                    }
                    setListings(prev => [...prev, ...res])
                })
            page++;
        }

    }, [inView])


    return (

        <section ref={ref} className="gap-8 mt-8 grid grid-cols-1 sm:gird-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:gird-cols-6">
            {listings}
            {loading &&
                <Spinner color="secondary" />
            }
        </section>
    )
}

export default LoadMore