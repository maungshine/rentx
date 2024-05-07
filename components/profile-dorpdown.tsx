import { CurrentUser } from "@/lib/form-schema";
import { getCurrentUser } from "@/lib/helper";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar, User } from "@nextui-org/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

function ProfileDropdown({ session, currentUser }: { session: Session | null, currentUser: CurrentUser | null }) {

    const handleGoogleSignOut = () => {
        signOut();
    }
    return (

        <Dropdown placement="bottom-start">
            <DropdownTrigger>
                <User
                    as="button"
                    avatarProps={{
                        isBordered: true,
                        src: currentUser?.profileImageUrl || session?.user?.image as string,
                    }}
                    className="transition-transform"
                    description={'@' + session?.user?.email?.split('@')[0]}
                    name={session?.user?.name}

                />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="solid" className="space-y-4 p-4">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">{session?.user?.name}</p>
                </DropdownItem>
                <DropdownItem href="/profile" key="profilePage">

                    Profile

                </DropdownItem>
                <DropdownItem href="/my-listing" key="yourListing">

                    Your Listings

                </DropdownItem>

                <DropdownItem key="logout" onClick={() => handleGoogleSignOut()}>
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>

    )
}

export default ProfileDropdown