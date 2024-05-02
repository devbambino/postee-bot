"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import LinkArea from "./components/linkarea";
import GeneratePostButton from "./components/generatepostbtn";
import ResetButton from "./components/resetbtn";
import GeneratedPost from "./components/generatedpost";
import Loading from "./components/loading";

export default function Chat() {
  // State variables with initial values
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState("");
  const [post, setPost] = useState("");

  // Function to copy text to clipboard and display success message
  function copyText(entryText: string) {
    navigator.clipboard.writeText(entryText);
    toast.success("Copied to clipboard!");
  }

  // Event handlers for prompt
  const handleLink = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    //console.log(`handlePrompt value: ${value}`);
    setLink(value);
  };

  // Loading state UI
  if (isLoading) {
    return <Loading/>;
  }

  if (!post) {
    return (
      <div className="flex flex-col h-screen w-full">
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <div className="grid gap-4">
            <h2 className="w-full text-center text-2xl text-green-500 font-bold">Welcome to PosteeBot</h2>
            <p className="w-full text-center text-xl">
              Helping small businesses sell more with engaging marketing content for social networks!
            </p>
            <LinkArea link={link} onLinkChange={handleLink} isLoading={false} />
            <GeneratePostButton link={link} onButtonClicked={async () => {
              setIsLoading(true);
              const response = await fetch("api/scraping", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userPrompt: link.trim(),
                }),
              });
              const data = await response.json();
              setPost(data.text);
              setIsLoading(false);
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        
        <ResetButton post={post} isLoading={isLoading} onButtonClicked={async () => {
              window.location.reload();
            }} />
        {post && !isLoading && <GeneratedPost post={post} onButtonClicked={() => copyText(post)} />}

      </div>
    </div>
  );

}