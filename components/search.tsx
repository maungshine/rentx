import React from "react";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "./search-icon";
import { Button } from "./ui/button";

export default function Search({ classnames }: { classnames?: string }) {
    return (
        <Input

            radius="lg"

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
                <Button type="submit" className="text-black/50 mb-0.5 bg-white/60 cursor-pointer rounded-2xl dark:text-white/90 backdrop-blur-lg flex-shrink-0 hover:text-neutral-800 hover:border-neutral-800 hover:border hover:bg-white/700" >Search</Button>
            }
        />
    );
}
