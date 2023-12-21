import { ApiResponse, Model,ResponseProvider, ResponseProviderOptions} from "./ResponseProvider";
import { ParsedResponseSuccess } from '../helpers/parseResponse';
import {GoogleGenerativeAI} from "@google/generative-ai"; // Assuming default export, adjust as necessary

class GeminiResponseProvider extends ResponseProvider {
    private api:any|null;

    constructor(options: ResponseProviderOptions = {}) {
        super(options);
        if(options?.apikey){
        this.api = new GoogleGenerativeAI(options?.apikey);
        }
    }

    // Converts a screenshot to a format suitable for the GoogleGenerativeAI API
    fileToGenerativePart(screenshotAsString: string, mimeType: string): any {
        return {
            inlineData: {
                data: this.formatImage(screenshotAsString),
                mimeType
            },
        };
    }
    formatImage(imageAsString: string): string {
        return imageAsString.replace(/^data:image\/(png|jpeg);base64,/, "");

    }
    formatPrompt(
        systemMessage: string,
        prompt: string,
      ): string {
      
        return `${systemMessage}\n\n${prompt}`;
      }
    // Generates a completion response using the Gemini model
     override async getCompletion(
      model: Model,
      systemMessage: string,
      prompt: string,
      taskInstructions: string,
      previousActions: ParsedResponseSuccess[],
      simplifiedDOM: string,
      screenshotAsString: string | null,
      maxAttempts:number,
      notifyError?: (error: string) => void,
    ): Promise<ApiResponse> {
        try {
          const formattedPrompt = this.formatPrompt(systemMessage, prompt);
          const generationConfig = {
            stopSequences: ["</Action>"],
            maxOutputTokens: 500,
            temperature: 0.0,
          };
            const geminiModel = this.api.getGenerativeModel({ model: model.name,generationConfig });
            const imageParts = screenshotAsString ? [this.fileToGenerativePart(screenshotAsString, "image/jpeg")] : [];
            const result = await geminiModel.generateContent([formattedPrompt, ...imageParts]);
            const geminiResponse = await result.response;
            const text = await geminiResponse.text()+"</Action>";

            return {
                usage: "Gemini",
                prompt: formattedPrompt,
                rawResponse: text,
                response: text,
            };
        } catch (error:any) {
            if (notifyError) {
                notifyError(error.toString());
            }
            throw error; // Rethrow after notification
        }
    }
}

export default GeminiResponseProvider;


  /*
  const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run() {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = "What's different between these pictures?";

  const imageParts = [
    fileToGenerativePart("image1.png", "image/png"),
    fileToGenerativePart("image2.jpeg", "image/jpeg"),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
*/