interface GeneratedPostProps {
    post: string;
    media: string;
    onButtonClicked: () => void;
}

export default function GeneratedPost({ post, media, onButtonClicked }: GeneratedPostProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="space-y-2">
                <h2 className="text-xl text-yellow-500 font-semibold tracking-tight">Here is the social network post:</h2>
            </div>
            <textarea
                className="min-h-[200px] border text-black p-3 m-2 rounded"
                id="summary"
                placeholder="The post will appear here."
                value={post}
                readOnly
            />
            <div className="flex flex-row items-center text-center gap-2 m-2">
                <p className="text-md leading-6 b-0 text-white">
                    Click the logo of the social network to copy to clipboard & open it:
                </p>
                <a
                    className="hover:bg-blue-500 text-yellow-500 hover:text-white border-2 border-blue-500 p-2 rounded disabled:opacity-50"
                    href={
                        media == "instagram" ?
                            "https://www.instagram.com" :
                            media == "facebook" ?
                                "https://www.facebook.com" :
                                "https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true"
                    } target="_blank"
                    onClick={onButtonClicked}>
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        {
                            media == "instagram" ?
                                <path fill="currentColor" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" />
                                :
                                media == "facebook" ?
                                    <path d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" />
                                    :
                                    <><path d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" />
                                        <path d="M7.2 8.809H4V19.5h3.2V8.809Z" /></>
                        }
                    </svg>
                </a>
            </div>
        </div>
    );
}