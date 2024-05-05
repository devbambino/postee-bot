import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    //Available models are: gpt-4, gpt-35-turbo-16k, text-embedding-ada-002, text-embedding-3-small, gpt-4-vision, gpt-4-32k, gpt-35-turbo"
    const { media, userPrompt, openaiApikey, openaiEndpoint } = await req.json();
    //console.log(`api link openaiApikey:${openaiApikey} && openaiEndpoint:${openaiEndpoint}`);
    const deploymentModelName = process.env.DEPLOY_MODEL_NAME_TEXT as string;

    const systemPromptLinkedin = "You're a LinkedIn influencer known for your insightful posts on industry trends and product recommendations. The user is providing you a HTML code that includes product data, interpret the information and formulate a professional, yet captivating marketing copy tailored for a LinkedIn audience. Where appropriate, include emojis to add a touch of personality, while maintaining the professional tone of the platform. The marketing copy must be between 150-250 words and concludes with up to 7 relevant hashtags (single words, no special characters). The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that corresponds to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, don't add additional text such as notes or recommendations – just the polished marketing copy and hashtags. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";
    const systemPromptInstagram = "You're an Instagram storyteller, skilled at capturing attention with visually-driven posts. The user is providing you a HTML code featuring product details, extract the necessary information and generate a creative and eye-catching marketing copy ideal for Instagram. The copy should include appropriate emojis to enhance visual appeal and engagement, in line with Instagram's image-centric platform. Keep it concise and impactful, the marketing copy must be between 150-250 words, using a creative and engaging writing style. Finish with up to 7 relevant, single-word hashtags to boost discoverability. The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that correspond to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, focus solely on crafting the perfect marketing copy and hashtags – don't add additional text such as notes, instructions or recommendations. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";
    const systemPromptFacebook = "Imagine you're a skilled blogger with a knack for crafting engaging Facebook posts that resonate with a diverse audience. The user is providing you a HTML code containing product information, extract the details and generate a vibrant and engaging marketing copy suitable for posting on Facebook. Please incorporate emoticons in the copy, where relevant, to make it more appealing and interactive for the Facebook audience. The marketing copy must be between 150-250 words. Use a charming and friendly writing style to connect with readers, and incorporate bullet points with emojis if appropriate. Finish with up to 7 relevant single-word hashtags. The text should be structured as several paragraphs and could include bullet points(using an emoji as the bullet that correspond to the text described) if needed. The hashtags must be always single words and don't have any other special characters beside the '#' such as '\'. Remember, don't add additional text such as notes, instructions or recommendations – just a captivating post with relevant hashtags. THE RESPONSE MUST BE ALWAYS WRITTEN IN ENGLISH.";

    let systemPrompt = systemPromptLinkedin;
    if (media == "facebook") {
      systemPrompt = systemPromptFacebook;
    } else if (media == "instagram") {
      systemPrompt = systemPromptInstagram;
    }

    const systemContentSafetyPrompt = "IMPORTANT: AFTER EXTRACTING THE TEXT FROM THE HTML YOU MUST CHECK THE SAFETY OF THE CONTENT PRESENT IN THE TEXT. THE TEXT MUST NOT CONTAIN ANY HATE, SEXUAL, VIOLENCE, OR SELF HARM REFERENCES, WORDS OR ANY OTHER EXPLICIT CONTENT THAT COULD OFFEND OR HARM OTHER PEOPLE. You must filter for categories like harassment, hate speech, sexually explicit material, and dangerous suggestions. IF YOU IDENTIFY ANY OF THAT CONTENT, EVEN AS IN SMALL QUANTITIES, YOU NEED TO RETURN THE FOLLOWING MESSAGE:'This kind of content is not allowed in this app. Please contact the support team If you think this is a mistake', AND YOU HAVE TO SUMMARIZE WHAT WAS THE REFERENCES CAUSING ISSUES.";

    try {
        const client = new OpenAIClient(openaiEndpoint, new AzureKeyCredential(openaiApikey));
        const responseScraping = await fetch(userPrompt);
        const dataScraping = await responseScraping.text();
        const bodyStart = dataScraping.indexOf("<body");
        const bodyEnd = dataScraping.indexOf("</body>");
        const dataScrapingBody = dataScraping.substring(bodyStart, bodyEnd);
        let limit32k = 32000 * 2.5;
        if(limit32k > dataScrapingBody.length){
            limit32k = dataScrapingBody.length - 1;
        }
        const dataScraping32k = dataScrapingBody.substring(0, limit32k);
        const messages = [
            { role: "system", content: systemPrompt },
            //{ role: "system", content: systemContentSafetyPrompt },
            { role: "user", content: dataScraping32k },
        ];

        let promptIndex = 0;
        const { choices, promptFilterResults } = await client.getChatCompletions(deploymentModelName, messages, { maxTokens: 700, temperature: 0.8 });
        let text = `${choices[0].message?.content}\nBuy here: ${userPrompt}`;
        
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
        console.log("api link error:", error);
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