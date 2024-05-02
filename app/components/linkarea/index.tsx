interface LinkAreaProps {
    link: string;
    isLoading: boolean;
    onLinkChange: (event: {
        target: {
            value: any;
        };
    }) => void;
}

export default function LinkArea({ link, isLoading, onLinkChange }: LinkAreaProps) {
    return (
        <div className="justify-center items-center my-1 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-md leading-6 font-semibold">
                <span className="w-full text-xl text-green-500 font-bold">Step 2 / </span>
                Paste here the link of the Shopify product you want us to create an engaging marketing post from:
            </h3>
            <textarea className="w-full min-h-[50px] border rounded text-black" name="article" disabled={isLoading} id="text" placeholder="Enter the link here..." value={link} onChange={onLinkChange} /> 
        </div>
    );
}