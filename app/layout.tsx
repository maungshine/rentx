import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "@/components/nav-bar";
import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/helper";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RentX",
  description: "RentX is an online property listing website.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>


          <NavBar session={session} currentUser={currentUser} />
          <main className="mb-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
