'use client';
import Link from "next/link"
import { FaExclamationTriangle } from "react-icons/fa"

function ErrorPage() {
    return (
        <div className='h-[100vh] flex flex-col justify-center gap-4 items-center'>
            <p className="flex flex-col gap-2 items-center">
                <FaExclamationTriangle className="text-6xl text-yellow-400" /> <span className="text-semibold text-2xl"> Something went wrong!</span>
            </p>
            <Link href='/' className='bg-danger-600 hover:bg-danger-400  text-white px-4 py-2 '>Go To Homepage</Link>
        </div>

    )
}

export default ErrorPage