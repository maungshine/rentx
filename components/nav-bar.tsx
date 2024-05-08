'use client';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Avatar } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ProfileDropdown from "./profile-dorpdown";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Search from "./search";
import Container from "./container";
import { AddListing } from "./add-listing";
import { usePathname } from "next/navigation";
import { UserWithListing } from "@/lib/helper";



function NavBar({ session, currentUser }: { session: Session | null, currentUser: UserWithListing | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Container classnames=" shadow-sm w-full">

            <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" >
                <NavbarContent >
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}

                    />

                    <NavbarBrand onClick={() => router.push('/')} className="cursor-pointer flex-grow-0">
                        <p className="font-bold text-inherit">RentX</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="flex" justify="center">
                    {pathname === '/' &&

                        <NavbarItem className="flex-1 md:flex hidden">
                            <form className="flex flex-col" >
                                <Search classnames="w-full" />
                            </form>
                        </NavbarItem>
                    }

                </NavbarContent>
                <NavbarContent justify="end">

                    {session &&
                        <NavbarItem >
                            <AddListing session={session} />
                        </NavbarItem>
                    }
                    {!session && (
                        <>
                            <NavbarItem className="flex">
                                <Link color="foreground" href="/signin" className="hover:mt-[2px] hover:border-b-2 hover:border-neutral-800">
                                    Login
                                </Link>
                            </NavbarItem>
                            <NavbarItem>
                                <Link color="foreground" href="/register" className="hover:mt-[2px] hover:border-b-2 hover:border-neutral-800" >
                                    Sign Up
                                </Link>
                            </NavbarItem>
                        </>
                    )}
                    {!!session?.user && (
                        <>
                            <NavbarItem>
                                <ProfileDropdown currentUser={currentUser} session={session} />
                            </NavbarItem>
                        </>
                    )}
                </NavbarContent>
                <NavbarMenu className="z-[999]">
                    <NavbarMenuItem>
                        <Link
                            className="w-full hover:underline"
                            href="/about-us"
                            size="md"
                            color="foreground"
                        >
                            About Us
                        </Link>
                    </NavbarMenuItem>

                    <NavbarMenuItem>
                        <Link
                            className="w-full hover:underline"
                            href="contact-us"
                            size="md"
                            color="foreground"

                        >
                            Contact Us
                        </Link>
                    </NavbarMenuItem>

                    <NavbarMenuItem>
                        <Link
                            className="w-full hover:underline"
                            href="/blog"
                            size="md"
                            color="foreground"
                        >
                            Blog
                        </Link>
                    </NavbarMenuItem>

                </NavbarMenu>
            </Navbar>
        </Container>
    )
}

export default NavBar;