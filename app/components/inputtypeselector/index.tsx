import { SVGProps } from "react";

interface InputTypeSelectorProps {
    types: { value: string; name: string; Icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => JSX.Element }[];
    selectedType: string;
    onTypeChange: ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputTypeSelector({ types, selectedType, onTypeChange }: InputTypeSelectorProps) {
    return (
        <div className="my-3 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            {/* ... type selection content ... */}
            <h3 className="text-md font-semibold text-white"><span className="w-full text-xl text-yellow-500 font-bold">Step 2 /</span> Select what you want to use for creating your compelling marketing post:</h3>
            <div className="flex flex-wrap justify-center">
                {types.map(({ value, name, Icon }) => (
                    <div
                        key={value}
                        className="m-2 border border-blue-600 font-bold text-yellow-500 px-4 py-2 rounded-lg"
                    >
                        <input
                            id={value}
                            type="radio"
                            value={value}
                            name="type"
                            className="accent-[#FFEB3B]"
                            checked={selectedType === value}
                            onChange={onTypeChange}
                        />
                        <label className="inline-flex ml-2" htmlFor={value}>
                            {`${name}`} <Icon className="h-4 w-4" />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}