import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";


function FormButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" color="primary" variant="solid" isLoading={pending}>
            {children}
        </Button>
    )
}

export default FormButton;