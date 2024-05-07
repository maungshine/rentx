'use client'
import { contact } from "@/actions/contactActions"
import { Button } from "@nextui-org/button"
import { Input, Textarea } from "@nextui-org/input"
import { useFormState } from "react-dom"


function ContactForm() {
    const [state, action] = useFormState(contact, {
        errors: {}

    })
    return (
        <section className="flex flex-col gap-4 h-screen ">
            {state.errors.success && (
                <div className="bg-green-200 text-green-600 border-2 border-green-300 py-3 px-2 rounded-lg">
                    {state.errors.success.join(', ')}
                </div>
            )}
            <form action={action} className="grid place-content-center h-full">
                <div className="p-8 flex flex-col gap-4 max-w-[600px] w-[400px] border-2 rounded-xl bg-gray-100">
                    <h1 className="px-2 text-center font-semibold text-neutral-800 text-xl">Contact Us</h1>
                    <Input
                        label='Name'
                        labelPlacement="inside"
                        placeholder="Enter your name..."
                        name="name"
                        variant="bordered"
                        isInvalid={!!state.errors.name}
                        errorMessage={state.errors.name?.join(', ')}
                    />
                    <Input
                        label='Email'
                        labelPlacement="inside"
                        placeholder="Enter your email..."
                        name="email"
                        variant="bordered"
                        isInvalid={!!state.errors.email}
                        errorMessage={state.errors.email?.join(', ')}
                    />
                    <Textarea
                        label='Subject'
                        labelPlacement="inside"
                        placeholder="What is it about..."
                        name="subject"
                        variant="bordered"
                        isInvalid={!!state.errors.subject}
                        errorMessage={state.errors.subject?.join(', ')}
                    />
                    {state.errors._form && (
                        <div className="bg-red-200 text-red-600 border-2 border-red-300 py-3 px-2 rounded-lg">
                            {state.errors._form.join(', ')}
                        </div>
                    )}
                    <div className="flex items-center justify-center">
                        <Button variant="bordered" type="submit" className="border-neutral-800 w-full bg-neutral-800 text-white">Submit</Button>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default ContactForm