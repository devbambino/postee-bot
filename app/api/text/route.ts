import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    //Available models are: gpt-4, gpt-35-turbo-16k, text-embedding-ada-002, text-embedding-3-small, gpt-4-vision, gpt-4-32k, gpt-35-turbo"
    const { userPrompt } = await req.json();
    const deploymentModelName = process.env.DEPLOY_MODEL_NAME_TEXT as string;

    const client = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT as string, new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY as string));

    const systemPromptLinkedin = "You're a LinkedIn influencer known for your insightful posts on industry trends and professional development. Your task is to transform the provided text into a compelling LinkedIn post. Analyze the text, identify key takeaways, and rephrase it into a concise, engaging summary with a professional tone. Consider incorporating emojis to enhance the visual storytelling and connect with your audience. The summary must be between 150-250 words and concludes with up to 7 relevant hashtags (single words, no special characters). Focus on delivering valuable insights and sparking professional conversations. The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that correspond to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, no additional text or recommendations – just the polished summary and hashtags. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

    const messages = [
        { role: "system", content: systemPromptLinkedin },
        { role: "user", content: userPrompt },
    ];

    /* EXAMPLE USING GPT VISION
    const url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
    const deploymentName = "gpt-4-vision";
    const messages: ChatRequestMessage[] = [{
        role: "user", content: [{
            type: "image_url",
            imageUrl: {
                url,
                detail: "auto"
            }
        }]
    }];
    const result = await client.getChatCompletions(deploymentName, messages);
    console.log(`Chatbot: ${result.choices[0].message?.content}`);
    */
    // Possible content safety implementation
    //https://learn.microsoft.com/en-us/javascript/api/overview/azure/ai-content-safety-rest-readme?view=azure-node-preview

    try {
        let promptIndex = 0;
        console.log(`api text deploymentModelName: ${deploymentModelName} messages: ${messages}`);
        const { choices } = await client.getChatCompletions(deploymentModelName, messages, { maxTokens: 700, temperature: 0.8 });
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