import { OpenAIClient, AzureKeyCredential, ChatRequestUserMessage, ChatRequestMessage } from '@azure/openai';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { media, userPrompt, mimeType, imageData, openaiEndpoint, openaiApikey } = await req.json();
    const deploymentModelName = process.env.DEPLOY_MODEL_NAME_IMAGE as string;

    const systemPromptLinkedin = "You're a LinkedIn influencer known for your insightful posts on industry trends and product recommendations. The user is providing you an image of a product that needs to be sold and a short description of it, interpret the information and formulate a professional, yet captivating marketing copy tailored for a LinkedIn audience. Where appropriate, include emojis to add a touch of personality, while maintaining the professional tone of the platform. The marketing copy must be between 150-250 words and concludes with up to 7 relevant hashtags (single words, no special characters). The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that corresponds to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, no additional text or recommendations – just the polished marketing copy and hashtags. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

    const systemPromptInstagram = "You're an Instagram storyteller, skilled at capturing attention with visually-driven posts. The user is providing you an image of a product that needs to be sold and a short description of it, extract the necessary information and generate a creative and eye-catching marketing copy ideal for Instagram. The copy should include appropriate emojis to enhance visual appeal and engagement, in line with Instagram's image-centric platform. Keep it concise and impactful, the marketing copy must be between 150-250 words, using a creative and engaging writing style. Finish with up to 7 relevant, single-word hashtags to boost discoverability. The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that correspond to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, focus solely on crafting the perfect marketing copy and hashtags – no additional notes or instructions. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

    const systemPromptFacebook = "Imagine you're a skilled blogger with a knack for crafting engaging Facebook posts that resonate with a diverse audience. The user is providing you an image of a product that needs to be sold and a short description of it, extract the details and generate a vibrant and engaging marketing copy suitable for posting on Facebook. Please incorporate emoticons in the copy, where relevant, to make it more appealing and interactive for the Facebook audience. The marketing copy must be between 150-250 words. Use a charming and friendly writing style to connect with readers, and incorporate bullet points with emojis if appropriate. Finish with up to 7 relevant single-word hashtags. The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that correspond to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, no extra commentary – just a captivating post with relevant hashtags. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";
    
    let systemPrompt = systemPromptLinkedin;
    if (media == "facebook") {
      systemPrompt = systemPromptFacebook;
    } else if (media == "instagram") {
      systemPrompt = systemPromptInstagram;
    }
    
    // Possible content safety implementation
    //https://learn.microsoft.com/en-us/javascript/api/overview/azure/ai-content-safety-rest-readme?view=azure-node-preview

    try {
        const client = new OpenAIClient(openaiEndpoint, new AzureKeyCredential(openaiApikey));
        //const url = "https://images.prismic.io/furbo-prismic/baebe4b9-ea9d-422a-a2ba-26b63e25c0d7_DOG+PDP_Prod+img_1.jpg?auto=compress%2Cformat&fit=max&w=3840";
        const url = `data:image/${mimeType};base64,${imageData}`;
        const userMessage: ChatRequestUserMessage = {
            role: "user", content: [
                {
                    type: "text",
                    text: userPrompt
                },
                {
                type: "image_url",
                imageUrl: {
                    url,
                    detail: "auto"
                }
            }]
        };
        const messages = [{ role: "system", content: systemPrompt }, userMessage];
        const { choices } = await client.getChatCompletions(deploymentModelName, messages, { maxTokens: 700, temperature: 0.9 });
        let text = choices[0].message?.content;

        const finishReason = choices[0].finishReason;
        let isSafe = true;
        if(finishReason == "content_filter"){
            text = "This kind of content is not allowed in this app. Please contact the support team If you think this is a mistake.";
            isSafe = false;
        }

        return NextResponse.json({
            text: text,
            safe: isSafe
        });
    } catch (error: any) {
        //console.log("api image error:", error);
        if(error){
            let text = "Unable to process this request. Please contact the support team and show this error: " + error.message;
            if(error.code == "content_filter"){
                text = "This kind of content is not allowed in this app. Reason: " + error.message;;
            }
            return NextResponse.json({
                text: text,
                safe: false
            });
        }
        return NextResponse.json({
            text: "Unable to process this request. Please contact the support team.",
            safe: false
        });
    }
}