interface InputAreaProps {
    type: string;
    description: string;
    imagePreviewUrl: string | null;
    isLoading: boolean;
    onDescriptionChange: (event: {
        target: {
            value: any;
        };
    }) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputArea({ type, description, imagePreviewUrl, isLoading, onDescriptionChange, onFileChange }: InputAreaProps) {
    return (
        <div className="justify-center items-center space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            {/* ... input area content based on type ... */}
            <h3 className="text-md leading-6 font-semibold text-white">
                <span className="w-full text-xl text-yellow-500 font-bold">Step 3 / </span>
                {
                    type == "image" ?
                        "Upload the image and write a short description..." :
                        "Paste here the link of the product..." 
                }
            </h3>
            {
                type == "image" ?
                    <div className="w-full flex flex-col justify-center items-center space-y-4">
                        <label className="flex flex-row text-center justify-center items-center sm:w-full md:w-1/2 font-bold hover:bg-blue-500 text-yellow-500 hover:text-white border border-blue-500 py-2 px-4 rounded disabled:opacity-50">
                            <input type="file" accept="image/*" onChange={onFileChange} />
                            <svg className="w-6 h-6 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd" />
                            </svg>
                            Select image...
                        </label>
                        {imagePreviewUrl && (
                            <div className="w-full  flex flex-row justify-center gap-2">
                                <img src={imagePreviewUrl} alt="Preview" style={{ height: "100%", maxHeight: "100px" }} />
                                <textarea className="w-full min-h-[100px] border rounded text-black" name="article" disabled={isLoading} id="text" placeholder="..write HERE a short description given us additional info of the offering, ex. price $35 but offering 50% time limeted discount..." value={description} onChange={onDescriptionChange} />
                            </div>
                        )}
                    </div> :
                    <textarea className="w-full min-h-[50px] border rounded text-black" name="article" disabled={isLoading} id="text" placeholder="Enter the link here..." value={description} onChange={onDescriptionChange} />
            }
        </div>
    );
}