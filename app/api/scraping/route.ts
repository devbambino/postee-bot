import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    //Available models are: gpt-4, gpt-35-turbo-16k, text-embedding-ada-002, text-embedding-3-small, gpt-4-vision, gpt-4-32k, gpt-35-turbo"
    const { userPrompt } = await req.json();
    const deploymentModelName = process.env.DEPLOY_MODEL_NAME_TEXT as string;

    const client = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT as string, new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY as string));

    const systemPromptLinkedin = "You're a LinkedIn influencer known for your insightful posts on industry trends and product recommendations. The user is providing you a HTML code that includes product data, interpret the information and formulate a professional, yet captivating marketing copy tailored for a LinkedIn audience. Where appropriate, include emojis to add a touch of personality, while maintaining the professional tone of the platform. The marketing copy must be between 150-250 words and concludes with up to 7 relevant hashtags (single words, no special characters). The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that corresponds to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, no additional text or recommendations – just the polished marketing copy and hashtags. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

    const systemPromptInstagram = "You're an Instagram storyteller, skilled at capturing attention with visually-driven posts. The user is providing you a HTML code featuring product details, extract the necessary information and generate a creative and eye-catching marketing copy ideal for Instagram. The copy should include appropriate emojis to enhance visual appeal and engagement, in line with Instagram's image-centric platform. Keep it concise and impactful, the marketing copy must be between 150-250 words, using a creative and engaging writing style. Finish with up to 7 relevant, single-word hashtags to boost discoverability. The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that correspond to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, focus solely on crafting the perfect marketing copy and hashtags – no additional notes or instructions. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

    const systemPromptFacebook = "Imagine you're a skilled blogger with a knack for crafting engaging Facebook posts that resonate with a diverse audience. The user is providing you a HTML code containing product information, extract the details and generate a vibrant and engaging marketing copy suitable for posting on Facebook. Please incorporate emoticons in the copy, where relevant, to make it more appealing and interactive for the Facebook audience. The marketing copy must be between 150-250 words. Use a charming and friendly writing style to connect with readers, and incorporate bullet points with emojis if appropriate. Finish with up to 7 relevant single-word hashtags. The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that correspond to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, no extra commentary – just a captivating post with relevant hashtags. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

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
        const responseScraping = await fetch(userPrompt);
        const dataScraping = await responseScraping.text();
        const bodyStart = dataScraping.indexOf("<body");
        const bodyEnd = dataScraping.indexOf("</body>");
        const dataScrapingBody = dataScraping.substring(bodyStart, bodyEnd);
        let limit32k = 32000 * 3;
        if(limit32k > dataScrapingBody.length){
            limit32k = dataScrapingBody.length - 1;
        }
        const dataScraping32k = dataScrapingBody.substring(0, limit32k);
        const messages = [
            { role: "system", content: systemPromptLinkedin },
            { role: "user", content: dataScraping32k },
        ];

        let promptIndex = 0;
        console.log(`api scraping deploymentModelName: ${deploymentModelName} messages: ${messages}`);
        const { choices } = await client.getChatCompletions(deploymentModelName, messages, { maxTokens: 700, temperature: 0.8 });
        for (const choice of choices) {
            const completion = choice.message?.content;
            console.log(`api scraping Input: ${messages[promptIndex++]}`);
            console.log(`api scraping Chatbot: ${completion}`);
        }
        const text = choices[0].message?.content;

        return NextResponse.json({
            text
        });
    } catch (error) {
        console.log("api scraping error:", error);
        return NextResponse.json({
            text: "Unable to process the prompt. Please try again. Error:" + error
        });
    }
}