import { FaEnvelope, FaFacebook, FaTelegram } from "react-icons/fa"

function Footer() {
    return (
        <footer className="flex items-center justify-center h-[100px] bg-neutral-100 mt-auto">
            <div className="flex gap-4">

                <FaFacebook className="text-4xl" />
                <FaTelegram className="text-4xl" />
                <FaEnvelope className="text-4xl" />
            </div>
        </footer>
    )
}

export default Footer