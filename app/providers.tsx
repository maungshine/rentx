'use client';

import { NextUIProvider } from "@nextui-org/react";
import { Session } from "next-auth";

import { Toaster } from "react-hot-toast"


function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>


            <div className="relative flex flex-col min-h-screen">

                <Toaster position='top-right' />

                {children}
            </div>

        </NextUIProvider>
    )
}

export default Providers;