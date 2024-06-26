import { SVGProps } from "react";

interface WelcomeProps {
    types: { value: string; name: string; Icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => JSX.Element }[];
    selectedType: string;
    onTypeChange: ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Welcome({ types, selectedType, onTypeChange }: WelcomeProps) {
    return (
        <div className="my-3 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            {/* ... type selection content ... */}
            <h3 className="text-md font-semibold"><span className="w-full text-xl text-yellow-500 font-bold">Step 1 /</span> Select what you want to use for creating your compelling marketing post:</h3>
            <div className="flex flex-wrap justify-center">
                {types.map(({ value, name, Icon }) => (
                    <div
                        key={value}
                        className="m-2 border border-blue-600 font-bold text-blue-600 px-4 py-2 rounded-lg"
                    >
                        <input
                            id={value}
                            type="radio"
                            value={value}
                            name="type"
                            className="accent-[#0672CB]"
                            checked={selectedType === value}
                            onChange={onTypeChange}
                        />
                        <label className="inline-flex ml-2" htmlFor={value}>
                            {`${name}`} <Icon className="h-6 w-6 mb-2" />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}