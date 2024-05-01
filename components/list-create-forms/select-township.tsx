import { FieldValues, UseFormRegister } from "react-hook-form";
import { category } from "../category"
import CategoryInput from "./category-input"
import { Dispatch, SetStateAction } from 'react';
import { FormValues, Names } from "../add-listing";

function SelectTownship({ setCustomValue, townshipSelect, setTownshipSelect, register }: { setCustomValue: (id: Names, value: any) => void, townshipSelect: string, setTownshipSelect: Dispatch<SetStateAction<string>>, register: UseFormRegister<FormValues> }) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mx-h-[50vh] overflow-y-auto" >
                <input type="text" className="hidden"  {...register('township')} value={townshipSelect} />
                {category.map((item) =>
                    <CategoryInput
                        onClick={() => {
                            if (townshipSelect === item) {
                                setCustomValue('township', '')
                                setTownshipSelect('')
                            } else {
                                setCustomValue('township', item)
                                setTownshipSelect(item)
                            }
                        }}
                        selected={townshipSelect === item}
                        label={item}
                        key={item}
                    />
                )}

            </div>
        </>
    )
}

export default SelectTownship