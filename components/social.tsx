
import { Button } from "@nextui-org/button";
import { FaGoogle } from "react-icons/fa";
import { handleGoogleSignIn } from "@/actions/authActions";

function Social() {
    return (
        <form action={handleGoogleSignIn} className="flex flex-col">
            <Button type="submit" color="primary" variant="solid">
                <FaGoogle className="text-white text-xl" />
            </Button>
        </form>
    )
}

export default Social;