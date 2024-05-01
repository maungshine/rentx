import { Skeleton } from "@nextui-org/react"

function SkeletonMap() {
    return (
        <div className="flex flex-col gap-4 p-4 h-full w-full">
            <Skeleton className="w-full h-[80px] rounded-xl" />
            <Skeleton className="w-full h-[80px] rounded-xl" />
            <Skeleton className="w-full h-[80px] rounded-xl" />
            <Skeleton className="w-full h-[60px] rounded-xl" />
        </div>
    )
}

export default SkeletonMap