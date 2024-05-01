"use client";

import { useState } from "react";

export default function Chat() {
  // State variables with initial values
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [post, setPost] = useState("");

  // Event handlers for prompt
  const handlePrompt = (event: { target: { value: any; }; }) => {
    const value = event.target.value;
    //console.log(`handlePrompt value: ${value}`);
    setPrompt(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="animate-pulse flex flex-col justify-center items-center ">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div>The magic is happening...bear with us...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-8 lg:py-10">
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="space-y-2">
            <h2 className="w-full text-center text-3xl text-green-500 font-bold">PosteeBot</h2>
            <p className="w-full text-center text-zinc-500 dark:text-zinc-400">
              Posting engaging content to social networks has never been easier thanks to PosteeBot!!!
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-full">
              <p className="my-2 text-md leading-6 b-0">
                Write/Paste here what you want to share:
              </p>
              <textarea className="w-full min-h-[200px] m-2 border rounded shadow-xl text-black" name="prompt" disabled={isLoading} id="text" placeholder="Enter the text here..." onChange={handlePrompt} />
            </div>
            <form className="flex flex-row items-start gap-2 md:gap-4">
              <button
                className="w-full md:w-auto order-2 md:order-1 m-2 bg-green-700 hover:bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  //console.log(`GeneratePost onClick prompt: ${prompt}`);
                  const response = await fetch("api/text", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userPrompt: prompt,
                    }),
                  });
                  //console.log(`GeneratePost onClick response: ${response}`);
                  const data = await response.json();
                  setPost(data.text);
                  setIsLoading(false);
                }}
              >Generate post</button>
              <button
                className="w-full md:w-auto order-2 md:order-1 m-2 bg-green-700 hover:bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading}
                onClick={async () => {
                  window.location.reload();
                }}
              >Reset</button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="space-y-2">
            <h2 className="text-lg text-green-500 font-semibold tracking-tight">Here's the social network post:</h2>
          </div>
          <textarea
            className="min-h-[100px] border text-black p-3 m-2 rounded"
            id="summary"
            placeholder="The post will appear here."
            value={post}
            readOnly
          />
        </div>

      </div>
    </div>
  );


}