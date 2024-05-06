import { getCurrentUser } from "@/lib/helper";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar, User } from "@nextui-org/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

async function ProfileDropdown({ session }: { session: Session | null }) {
    const currentUser = await getCurrentUser();
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
            <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">{session?.user?.name}</p>
                </DropdownItem>
                <DropdownItem key="settings">
                    <Link href='/profile'>
                        Profile
                    </Link>
                </DropdownItem>

                <DropdownItem key="logout" color="danger" as={Button} onClick={() => handleGoogleSignOut()}>
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>

    )
}

export default ProfileDropdown