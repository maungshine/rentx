import { Input, Textarea } from "@nextui-org/input"
import { Switch } from "@nextui-org/react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormValues, Names } from "../add-listing";

interface PriceAvailabilityProps {
    availability: boolean;
    register: UseFormRegister<FormValues>;
    setCustomValue: (id: Names, value: any) => void;
    errors: FieldErrors<FormValues>;
}

function PriceAvailability({ setCustomValue, availability, register, errors }: PriceAvailabilityProps) {

    return (
        <div className="flex flex-col gap-8 mb-2 h-[50vh] w-full">
            <Input
                type="number"
                label='Rental Fees'
                labelPlacement="inside"
                variant="bordered"
                placeholder="Enter the fees"
                isInvalid={!!errors.price?.message}
                errorMessage={errors.price?.message}
                {...register('price', { required: 'Price is required' })}
            />

            <hr />
            <div className="flex justify-between items-center">
                <p>Availability</p>
                <input type="radio" value={availability ? 'true' : 'false'} className="hidden" {...register('availability')} />
                <div className="flex gap-2 items-center">
                    <Switch isSelected={availability} onValueChange={() => {
                        setCustomValue('availability', !availability)
                    }} />
                </div>
            </div>
        </div>
    )
}

export default PriceAvailability