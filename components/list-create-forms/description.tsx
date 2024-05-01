import { Input, Textarea } from "@nextui-org/input"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { FormValues } from "../add-listing";

interface TitleDescriptionProps {
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;

}

function TitleDescription({ register, errors }: TitleDescriptionProps) {

    return (
        <div className="flex flex-col gap-2 mb-2">
            <Input
                type="text"
                label='Title'
                labelPlacement="inside"
                placeholder="Enter the tile"
                variant="bordered"
                isInvalid={!!errors.title?.message}
                errorMessage={errors.title?.message}
                {...register('title', { required: 'Title is required' })}

            />

            <Textarea
                label='Description'
                labelPlacement="inside"
                variant="bordered"
                placeholder="Description is required"
                isInvalid={!!errors.description?.message}
                errorMessage={errors.description?.message}
                {...register('description', { required: 'Description is required.' })}
            />
        </div>
    )
}

export default TitleDescription