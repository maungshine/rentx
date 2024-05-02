import { FieldValues, UseFormRegister } from "react-hook-form";
import CategoryInput from "./category-input"
import { Dispatch, SetStateAction } from 'react';
import { FormValues, Names } from "../add-listing";

export const types = [
    'Apartment',
    'Condon',
    'Studio',
    'House',
    'Hostel',
    'Share Room'
]


function SelectType({ typeSelect, setTypeSelect, register, setCustomValue }: { setCustomValue: (id: Names, value: any) => void, typeSelect: string, setTypeSelect: Dispatch<SetStateAction<string>>, register: UseFormRegister<FormValues> }) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[50vh] overflow-y-auto" >
                <input type="text" className="hidden" {...register('type')} value={typeSelect} />
                {types.map((item) =>
                    <CategoryInput
                        onClick={() => {
                            if (typeSelect === item) {
                                setCustomValue('type', '');
                                setTypeSelect('');
                            } else {
                                setCustomValue('type', item);
                                setTypeSelect(item);
                            }
                        }}
                        selected={typeSelect === item}
                        label={item}
                        key={item}
                    />
                )}

            </div>
        </>
    )
}

export default SelectType;