import { auth } from "@/auth"
import Container from "@/components/container"
import ProfileInfo from "@/components/profile-info";
import ProfileUpload from "@/components/profile-upload";
import { getCurrentUser } from "@/lib/helper";
import { SessionProvider } from "next-auth/react";


async function ProfilePage() {
    const session = await auth();
    const currentUser = await getCurrentUser();
    return (
        <Container>
            <SessionProvider session={session}>

                <section className="flex flex-col gap-4 items-center justify-center">
                    <ProfileUpload currentUser={currentUser} session={session} />
                    <ProfileInfo currentUser={currentUser} />
                </section>
            </SessionProvider>
        </Container>
    )
}

export default ProfilePage