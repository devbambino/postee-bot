import { SVGProps } from "react";

interface WelcomeProps {
    types: { value: string; name: string; Icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => JSX.Element }[];
    onTypeSelect: (type: string) => void;
}

export default function Welcome({ types, onTypeSelect }: WelcomeProps) {
    return (
        <div className="flex flex-col h-screen w-full">
            {/* ... welcome message and type selection content ... */}
            <div className="flex-1 flex items-center justify-center p-4 text-center">
                <div className="grid gap-4">
                    <h2 className="w-full text-center text-2xl text-green-500 font-bold">Welcome to PosteeBot</h2>
                    <p className="w-full text-center text-xl">
                        Helping small businesses sell more with engaging marketing content for social networks!
                    </p>
                    <p className="w-full text-center text-xl text-zinc-500 dark:text-zinc-400">
                        We create compelling marketing posts from whatever you shared with us:
                    </p>
                    <div className="mx-auto w-[400px] mt-8">
                        <div className="grid grid-cols-3 gap-4 text-green-500">
                            {types.map(({ value, name, Icon }) => (
                                <div
                                    key={value}
                                    className="flex flex-col items-center justify-center cursor-pointer rounded-lg font-semibold hover:bg-green-500 hover:text-white border border-green-500 p-4 text-center"
                                    onClick={() => onTypeSelect(value)}
                                >
                                    <Icon className="h-6 w-6 mb-2" />
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}