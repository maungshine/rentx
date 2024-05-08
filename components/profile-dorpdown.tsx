import { UserWithListing } from "@/lib/helper";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar, User } from "@nextui-org/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";


function ProfileDropdown({ session, currentUser }: { session: Session | null, currentUser: UserWithListing | null }) {

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
                    name={''}

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
                <DropdownItem href="/listing/my-listing" key="yourListing">

                    My Listings

                </DropdownItem>
                <DropdownItem href="/listing/my-favourites" key="favourites">

                    Favourites

                </DropdownItem>

                <DropdownItem key="logout" onClick={() => handleGoogleSignOut()}>
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>

    )
}

export default ProfileDropdown