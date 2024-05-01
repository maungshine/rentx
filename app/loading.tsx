import { Spinner } from "@nextui-org/react"

function Loading() {
    return (
        <div className="h-[100vh] flex items-center justify-center">
            <Spinner />
        </div>
    )
}

export default Loading