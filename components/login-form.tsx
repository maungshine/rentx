'use client';
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import Social from "./social";
import { login } from "@/actions/authActions";
import { useFormState } from "react-dom";
import FormButton from "./form-button";

function LoginForm() {
    const [state, action] = useFormState(login, {
        errors: {}
    });
    return (
        <div className="w-[400px] mx-auto h-[100vh] flex flex-col" >
            <div className="my-auto flex flex-col gap-8">
                <div>
                    <h2 className="text-center font-semibold text-2xl">Login</h2>
                </div>
                <form action={action} className="space-y-8 flex flex-col">
                    <Input
                        type="email"
                        variant="bordered"
                        label="Email"
                        labelPlacement="inside"
                        name="email"
                        placeholder="johndoe@demo.com"
                        isInvalid={!!state.errors.email}
                        errorMessage={state.errors.email?.join(', ')}
                    />
                    <Input
                        type="password"
                        variant="bordered"
                        label='Name'
                        labelPlacement="inside"
                        name="password"
                        placeholder="******"
                        isInvalid={!!state.errors.password}
                        errorMessage={state.errors.password?.join(', ')}
                    />
                    <Link href='/get-reset-link' className="text-gray-400 text-sm" underline="hover">Forget password?</Link>
                    {state.errors._form && (
                        <div className="bg-red-200 text-red-600 border-2 border-red-300 py-3 px-2 rounded-lg">
                            {state.errors._form.join(', ')}
                        </div>
                    )}
                    <FormButton>Login</FormButton>
                </form>
                <p className="text-gray-400 text-center">Or Register with Google</p>
                <Social />
            </div>
        </div>
    )
}

export default LoginForm