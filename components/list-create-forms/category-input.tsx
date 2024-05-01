import { IconType } from "react-icons/lib";

interface CategoryInputProps {
    onClick: (value: string) => void;
    selected: boolean;
    label: string;
    icon?: IconType
}

function CategoryInput({ icon, label, selected, onClick }: CategoryInputProps) {
    return (
        <div
            onClick={() => onClick(label)}
            className={`
                rounded-xl
                border-2
                p-4
                flex
                flex-col
                gap-3
                hover:border-black
                transtion
                cursor-pointer
                ${selected ? 'border-black' : 'border-neutral-200'}
            `}
        >

            <div className="font-semibold text-nowrap">
                {label}
            </div>
        </div>
    )
}

export default CategoryInput