import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { userPrompt } = await req.json();
    const deploymentModelName = process.env.DEPLOY_MODEL_NAME_TEXT as string;

    const client = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT as string, new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY as string));

    const systemPrompt = "You are a professional marketer and social networks influencer that writes super engaging tweets in Twitter about different topics. The user is going to give you a marketing copy of a product that needs to be sold. You have to rewrite the marketing text if needed and split it into LESS THAN 6 TEXT MESSAGES suitable for twitter posts (no more than 280 characters per post) including up to 5 relevant hashtags. All the twitter posts must be sequential and must make sense as a whole. The writing style should be charming, engaging but professional. YOU MUST RETURN the response as a JSON ARRAY that contains the twitter posts generated as JSON objects with a string field called 'tweet' containing the twitter post. DON'T ADD ANY EXTRA TEXT BESIDES THE JSON OBJECT. THE JSON FILE MUST HAVE THE PROPER JSON STRUCTURE FOR THE OBJECTS AND ARRAYS ALWAYS INCLUDING THE STARTING AND ENDING SPECIAL CHARACTERS: '[',']','{','}'. THE RESPONSES MUST BE ALWAYS WRITTEN IN ENGLISH.";

    // Possible content safety implementation
    //https://learn.microsoft.com/en-us/javascript/api/overview/azure/ai-content-safety-rest-readme?view=azure-node-preview

    try {
        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ];

        console.log(`api tweets deploymentModelName: ${deploymentModelName} messages: ${messages}`);
        const { choices } = await client.getChatCompletions(deploymentModelName, messages, { maxTokens: 700, temperature: 0.7 });
        const text = choices[0].message?.content;

        return NextResponse.json({
            text
        });
    } catch (error: any) {
        console.log("api tweets error:", error);
        return NextResponse.json({
            text: "Unable to process the prompt. Please contact the support team and show this error: " + error.message
        });
    }
}