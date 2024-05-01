import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    //Available models are: gpt-4, gpt-35-turbo-16k, text-embedding-ada-002, text-embedding-3-small, gpt-4-vision, gpt-4-32k, gpt-35-turbo"
    const { userPrompt } = await req.json();
    const deploymentModelName = process.env.DEPLOY_MODEL_NAME_TEXT as string;

    const client = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT as string, new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY as string));

    const messages = [
      { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
      { role: "user", content: "Can you help me?" },
      { role: "assistant", content: "Arrrr! Of course, me hearty! What can I do for ye?" },
      { role: "user", content: "What's the best way to train a parrot?" },
    ];

    try {
        let promptIndex = 0;
        console.log(`api text deploymentModelName: ${deploymentModelName} messages: ${messages}`);
        const { choices } = await client.getChatCompletions(deploymentModelName, messages, { maxTokens: 300 });
        for (const choice of choices) {
            const completion = choice.message?.content;
            console.log(`api text Input: ${messages[promptIndex++]}`);
            console.log(`api text Chatbot: ${completion}`);
        }
        const text = choices[0].message?.content;

        return NextResponse.json({
            text
        });
    } catch (error) {
        console.log("api text error:", error);
        return NextResponse.json({
            text: "Unable to process the prompt. Please try again. Error:" + error
        });
    }
}