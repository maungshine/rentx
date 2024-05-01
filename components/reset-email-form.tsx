'use client';
import { Input } from "@nextui-org/input";
import { getResetPasswordLink } from "@/actions/authActions";
import { useFormState } from "react-dom";
import FormButton from "@/components/form-button";

function ResetEmailForm() {

    const [state, action] = useFormState(getResetPasswordLink, { errors: {}, success: {} })


    return (
        <div className="w-[400px] mx-auto h-[100vh] flex flex-col" >
            <div className="my-auto flex flex-col gap-8">
                <div>
                    <h2 className="text-center font-semibold text-2xl">Get Password Reset Link To Your Inbox</h2>
                </div>
                {state.success.message && (
                    <div className="bg-green-200 text-green-600 border border-2 border-green-300 py-3 px-2 mt-4 rounded-lg">
                        {state.success.message.join(', ')}
                    </div>
                )}
                <form action={action} className="space-y-8 flex flex-col">

                    <Input
                        variant="bordered"
                        label="Email"
                        labelPlacement="inside"
                        name="email"
                        placeholder="johndoe@demo.com"
                        isInvalid={!!state.errors.email}
                        errorMessage={state.errors.email?.join(', ')}
                    />

                    {state.errors._form && (
                        <div className="bg-red-200 text-red-600 border border-2 border-red-300 py-3 px-2 rounded-lg">
                            {state.errors._form.join(', ')}
                        </div>
                    )}
                    <FormButton>Get Link</FormButton>
                </form>
            </div>
        </div>
    )

}

export default ResetEmailForm;