'use client';

import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast"


function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <div className="relative">

                <Toaster position='top-right' />

                {children}
            </div>
        </NextUIProvider>
    )
}

export default Providers;