'use client';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Avatar } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ProfileDropdown from "./profile-dorpdown";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Search from "./search";
import Container from "./container";
import { AddListing } from "./add-listing";
import { CurrentUser } from "@/lib/form-schema";



function NavBar({ session, currentUser }: { session: Session | null, currentUser: CurrentUser | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    return (
        <Container>

            <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" >
                <NavbarContent >
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />

                    <NavbarBrand onClick={() => router.push('/')} className="cursor-pointer flex-grow-0">
                        <p className="font-bold text-inherit">RentX</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="flex" justify="center">

                    <NavbarItem className="flex-1 md:flex hidden">
                        <form className="flex flex-col" >
                            <Search classnames="w-full" />
                        </form>
                    </NavbarItem>
                    <NavbarItem className="inline-block md:hidden">
                        <AddListing session={session} />
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    {!session && (
                        <>
                            <NavbarItem className="flex">
                                <Button as={Link} color="primary" href="/signin" variant="flat">
                                    Login
                                </Button>
                            </NavbarItem>
                            <NavbarItem>
                                <Button as={Link} color="primary" href="/register" variant="flat">
                                    Sign Up
                                </Button>
                            </NavbarItem>
                        </>
                    )}
                    <NavbarItem className="hidden md:inline-block">
                        <AddListing session={session} />
                    </NavbarItem>
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