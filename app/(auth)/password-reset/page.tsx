'use client';
import { Input } from "@nextui-org/input";
import { resetPassword } from "@/actions/authActions";
import { useFormState } from "react-dom";
import FormButton from "@/components/form-button";
import { useSearchParams } from "next/navigation";

function PasswordReset() {

    const [state, action] = useFormState(resetPassword, { errors: {}, success: {} })
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    return (
        <div className="w-[400px] mx-auto h-[100vh] flex flex-col" >
            <div className="my-auto flex flex-col gap-8">
                <div>
                    <h2 className="text-center font-semibold text-2xl">Reset Your Password</h2>
                </div>
                {state.success.message && (
                    <div className="bg-green-200 text-green-600 border border-2 border-green-300 py-3 px-2 mt-4 rounded-lg">
                        {state.success.message.join(', ')}
                    </div>
                )}
                <form action={action} className="space-y-8 flex flex-col">
                    <Input type="text" value={token} name="token" className="hidden" />
                    <Input
                        type="password"
                        variant="bordered"
                        label="New Password"
                        labelPlacement="inside"
                        name="newPassword"
                        placeholder="******"
                        isInvalid={!!state.errors.newPassword}
                        errorMessage={state.errors.newPassword?.join(', ')}
                    />
                    <Input
                        type="password"
                        variant="bordered"
                        label='Confirm Password'
                        labelPlacement="inside"
                        name="password"
                        placeholder="******"
                        isInvalid={!!state.errors.password}
                        errorMessage={state.errors.password?.join(', ')}
                    />
                    {state.errors._form && (
                        <div className="bg-red-200 text-red-600 border border-2 border-red-300 py-3 px-2 rounded-lg">
                            {state.errors._form.join(', ')}
                        </div>
                    )}
                    <FormButton>Reset</FormButton>
                </form>
            </div>
        </div>
    )

}

export default PasswordReset