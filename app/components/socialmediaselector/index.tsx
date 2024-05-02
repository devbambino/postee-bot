interface SocialMediaSelectorProps {
    medias: { value: string; name: string }[];
    selectedMedia: string;
    onMediaChange: ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SocialMediaSelector({ medias, selectedMedia, onMediaChange }: SocialMediaSelectorProps) {
    return (
        <div className="my-3 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            {/* ... social media selection content ... */}
            <h3 className="text-md font-semibold"><span className="w-full text-xl text-green-500 font-bold">Step 1 /</span> Select the social network...</h3>
            <div className="flex flex-wrap justify-center">
                {medias.map(({ value, name }) => (
                    <div
                        key={value}
                        className="m-2 border border-green-500 font-bold text-green-500 px-4 py-2 rounded-lg"
                    >
                        <input
                            id={value}
                            type="radio"
                            value={value}
                            name="media"
                            className="accent-[#48bb78]"
                            checked={selectedMedia === value}
                            onChange={onMediaChange}
                        />
                        <label className="ml-2" htmlFor={value}>
                            {`${name}`}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}