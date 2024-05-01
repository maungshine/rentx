'use client';
import { Input } from "@nextui-org/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormValues, Names } from "../add-listing";



interface AddressProps {
    errors: FieldErrors<FormValues>;
    register: UseFormRegister<FormValues>;
}

function Address({ register, errors }: AddressProps) {

    return (
        <div className="flex flex-col gap-4">
            <Input
                type="text"
                label='City'
                placeholder="Enter the city"
                labelPlacement="inside"
                variant="bordered"
                isInvalid={!!errors.city?.message}
                errorMessage={errors.city?.message}
                {...register('city', { required: 'City is requred' })}
            />
            <Input
                type="text"
                label='Township'
                placeholder="Enter the township"
                labelPlacement="inside"
                variant="bordered"
                isInvalid={!!errors.townshipRepeat?.message}
                errorMessage={errors.townshipRepeat?.message}
                {...register('townshipRepeat', { required: 'Township is required' })}
            />

            <Input
                type="text"
                label='ward'
                placeholder="Enter the ward"
                labelPlacement="inside"
                variant="bordered"
                isInvalid={!!errors.ward?.message}
                errorMessage={errors.ward?.message}
                {...register('ward', { required: "Ward is required" })}
            />

            <Input
                type="text"
                label='Street'
                placeholder="Enter the ward"
                labelPlacement="inside"
                variant="bordered"
                isInvalid={!!errors.street?.message}
                errorMessage={errors.street?.message}
                {...register('street', { required: 'Street is required' })}
            />
            <Input
                type="text"
                label='Property Number'
                labelPlacement="inside"
                placeholder="Enter the number"
                variant="bordered"
                isInvalid={!!errors.num?.message}
                errorMessage={errors.num?.message}
                {...register('num', { required: 'Porperty number is required' })}
            />
        </div>

    )
}

export default Address;

