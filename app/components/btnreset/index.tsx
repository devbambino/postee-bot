interface ButtonResetProps {
  post: string;
  isLoading: boolean;
  onButtonClicked: () => void;
}

export default function ButtonReset({ post, isLoading, onButtonClicked }: ButtonResetProps) {
  return (
    <button
      className="inline-flex items-center w-full md:w-auto order-3 m-2 font-bold hover:bg-blue-500 text-yellow-500 hover:text-white border-2 border-blue-500 py-2 px-4 rounded disabled:opacity-50"
      hidden={post.length == 0}
      disabled={isLoading}
      onClick={onButtonClicked}
    >
      <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="currentColor" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
      </svg>
      <span>Reset</span>
    </button>
  );
}