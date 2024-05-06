import { auth } from "@/auth"
import Container from "@/components/container"
import ProfileInfo from "@/components/profile-info";
import ProfileUpload from "@/components/profile-upload";
import { getCurrentUser } from "@/lib/helper";



async function ProfilePage() {
    const session = await auth();
    const currentUser = await getCurrentUser();
    return (
        <Container>



            <section className="flex flex-col gap-4 items-center justify-center">
                <ProfileUpload currentUser={currentUser} session={session} />
                <ProfileInfo session={session} currentUser={currentUser} />
            </section>

        </Container>
    )
}

export default ProfilePage