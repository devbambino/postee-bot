"use client";

import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import GeneratePostButton from "./components/generatepostbtn";
import ResetButton from "./components/resetbtn";
import GeneratedPost from "./components/generatedpost";
import Loading from "./components/loading";
import SocialMediaSelector from "./components/socialmediaselector";
import IconImage from "./components/iconimage";
import IconLink from "./components/iconlink";
import Welcome from "./components/welcome";
import InputArea from "./components/inputarea";

export default function Chat() {
  // State variables with initial values
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [post, setPost] = useState("");
  const [type, setType] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Options for input types and social media platforms
  const types = [
    { value: "image", name: "Use an image...", Icon: IconImage },
    { value: "link", name: "From a link...", Icon: IconLink },
  ];
  const medias = [
    { value: "linkedin", name: "Linkedin" },
    { value: "facebook", name: "Facebook" },
    { value: "instagram", name: "Instagram" },
  ];

  // State for selected media
  const [state, setState] = useState({
    media: "linkedin",
  });

  // Function to copy text to clipboard and display success message
  function copyText(entryText: string) {
    navigator.clipboard.writeText(entryText);
    toast.success("Copied to clipboard!");
  }
  
  // Event handlers for description, media change, and file upload 
  const handleDescription = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    setDescription(value);
  };
  const handleMediaChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const fileType = file.type;
      setMimeType(fileType); // Set MIME type in state

      if (/^image\/(jpeg|png|gif)$/.test(fileType)) {
        const reader = new FileReader();
        reader.onloadend = function () {
          const resultBase64 = reader.result as string;
          setImageData(resultBase64.split(",")[1]); // Set base64 string in state
          setImagePreviewUrl(resultBase64); // Set image URL for preview
        };
        reader.readAsDataURL(file);
      } else {
        alert("File type not supported. Please upload an image (jpeg, png, gif).");
      }
    }
  };

  // Loading state UI
  if (isLoading) {
    return <Loading/>;
  }

  // Initial UI for selecting input type
  if (!type) {
    return <Welcome types={types} onTypeSelect={setType} />;
  }

  // Main UI after input type selection
  return (
    <div className="px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {/* Steps for selecting social media and providing input */}
        <div className="flex flex-col gap-2">
          {!post && (
            <div className="w-full">
              <h2 className="w-full text-2xl text-green-500 font-bold">Hello, guest!!!</h2>

              <SocialMediaSelector medias={medias} selectedMedia={state.media} onMediaChange={handleMediaChange} />

              <InputArea type={type} description={description} onDescriptionChange={handleDescription} onFileChange={handleFileChange} imagePreviewUrl={imagePreviewUrl} isLoading={false} />

            </div>
          )}
          <form className="flex flex-row items-start gap-2 md:gap-4">
            {!post && (
              <GeneratePostButton description={description} onButtonClicked={async () => {
                setIsLoading(true);
                if (type == "image") {
                  const response = await fetch("api/image", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userPrompt: description,
                      media: state.media,
                      mimeType: mimeType,
                      imageData: imageData
                    }),
                  });
                  const data = await response.json();
                  setPost(data.text);
                } else if (type == "link") {
                  const response = await fetch("api/link", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userPrompt: description.trim(),
                      media: state.media,
                    }),
                  });
                  const data = await response.json();
                  setPost(data.text);
                } 
                setIsLoading(false);
              }} />
            )}
            <ResetButton post={post} isLoading={isLoading} onButtonClicked={async () => {
              window.location.reload();
            }} />
          </form>
        </div>

        {/* Post generation and display section */}
        {post && !isLoading && <GeneratedPost post={post} media={state.media} onButtonClicked={() => copyText(post)} />}
      </div>
    </div>
  );

}