import { Button } from "@nextui-org/button"
import { Switch } from "@nextui-org/react"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { FieldValues, UseFormRegister } from "react-hook-form";
import { FaMinus, FaPlus } from "react-icons/fa"
import { FormValues, Names } from "../add-listing";

interface AmentiesProps {
    amentiesList: {
        bedroom: number,
        bath: number,
        parking: boolean
    };
    register: UseFormRegister<FormValues>;
    setCustomValue: (id: Names, value: any) => void;
}

function Amenties({ amentiesList, register, setCustomValue }: AmentiesProps) {
    let { bedroom, bath, parking } = amentiesList;

    return (
        <div className="flex gap-8 flex-col h-[50vh] w-full mt-4">
            <div className="flex justify-between items-center">
                <p>Bedroom</p>
                <input type="number" {...register('bedroom')} />
                <div className="flex gap-2 items-center">
                    <span onClick={() => setCustomValue('bedroom', bedroom + 1)} className="px-2 py-2 border-2 border-slate-300 bg-slate-400 text-white rounded-full cursor-pointer" > <FaPlus /> </span>
                    <span>{bedroom}</span>
                    <span onClick={() => {
                        if (bedroom === 0) {
                            setCustomValue('bedroom', 0)

                        }
                        setCustomValue('bedroom', bedroom - 1)

                    }} className="px-2 py-2 border-2 border-slate-300 bg-slate-400 text-white rounded-full cursor-pointer" > <FaMinus /> </span>
                </div>
            </div>
            <hr />
            <div className="flex justify-between items-center">
                <p>Bathroom</p>
                <input type="number" className="hidden" {...register('bath')} value={bath} />
                <div className="flex gap-2 items-center">
                    <span onClick={() => {

                        setCustomValue('bath', bath + 1)

                    }} className="px-2 py-2 border-2 border-slate-300 bg-slate-400 text-white rounded-full cursor-pointer" > <FaPlus /> </span>
                    <span>{bath}</span>
                    <span onClick={() => {
                        if (bath === 0) {
                            setCustomValue('bath', 0)
                        }
                        setCustomValue('bath', bath - 1)

                    }} className="px-2 py-2 border-2 border-slate-300 bg-slate-400 text-white rounded-full cursor-pointer" > <FaMinus /> </span>
                </div>
            </div>
            <hr />
            <div className="flex justify-between items-center">
                <p>Parking Availability</p>
                <input type="radio" className="hidden" {...register('parking')} value={parking ? 'true' : 'false'} />
                <div className="flex gap-2 items-center">
                    <Switch isSelected={parking} onValueChange={() => {

                        setCustomValue('parking', !parking)

                    }} />
                </div>
            </div>
        </div>

    )
}

export default Amenties