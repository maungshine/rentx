'use client';
import { useFormState } from "react-dom";
import { Input } from "@nextui-org/input";
import Social from "./social";
import { register } from "@/actions/authActions";
import FormButton from "./form-button";


function RegisterForm() {
    const [formState, action] = useFormState(register, {
        errors: {}, success: {}
    });
    return (
        <div className="max-w-[400px] mx-auto h-[100vh] flex flex-col" >
            <div className="my-auto flex flex-col gap-8 border-2 rounded-xl bg-gray-100 p-8">
                <div>
                    <h2 className="text-center font-semibold text-2xl">Create an account</h2>
                    {formState.success.message && (
                        <div className="bg-green-200 text-green-600 border-2 border-green-300 py-3 px-2 mt-4 rounded-lg">
                            {formState.success.message.join(', ')}
                        </div>
                    )}
                </div>
                <form action={action} className="space-y-8 flex flex-col">
                    <Input
                        type="text"
                        variant="bordered"
                        label="Username"
                        labelPlacement="inside"
                        name="username"
                        placeholder="johndoe"
                        isInvalid={!!formState.errors.username}
                        errorMessage={formState.errors.username?.join(', ')}
                    />
                    <Input
                        type="email"
                        variant="bordered"
                        label="Email"
                        labelPlacement="inside"
                        name="email"
                        placeholder="johndoe@demo.com"
                        isInvalid={!!formState.errors.email}
                        errorMessage={formState.errors.email?.join(', ')}
                    />
                    <Input
                        type="password"
                        variant="bordered"
                        label='Password'
                        labelPlacement="inside"
                        name="password"
                        placeholder="******"
                        isInvalid={!!formState.errors.password}
                        errorMessage={formState.errors.password?.join(', ')}
                    />

                    {formState.errors._form && (
                        <div className="bg-red-200 text-red-600 border border-2 border-red-300 py-3 px-2 rounded-lg">
                            {formState.errors._form.join(', ')}
                        </div>
                    )}
                    <FormButton>Register</FormButton>
                </form>
                <p className="text-gray-400 text-center">Or Register with Google</p>
                <Social />
            </div>
        </div>
    )
}

export default RegisterForm;