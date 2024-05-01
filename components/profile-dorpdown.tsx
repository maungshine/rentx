import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar, User } from "@nextui-org/react";
import { signOut } from "next-auth/react";

function ProfileDropdown() {
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
                        src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                    }}
                    className="transition-transform"
                    description="@tonyreichert"
                    name="Tony Reichert"

                />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">@tonyreichert</p>
                </DropdownItem>
                <DropdownItem key="settings">
                    My Settings
                </DropdownItem>

                <DropdownItem key="logout" color="danger" as={Button} onClick={() => handleGoogleSignOut()}>
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>

    )
}

export default ProfileDropdown