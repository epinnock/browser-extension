import {ApiResponse, Model, ResponseProvider, ResponseProviderOptions}  from "./ResponseProvider";
import OpenAI from 'openai';
import { ParsedResponseSuccess } from '../helpers/parseResponse';


export default class OpenAIResponseProvider extends ResponseProvider {
    private api: OpenAI;

    constructor(options: ResponseProviderOptions = {}) {
        super(options);
        this.api = new OpenAI({
            apiKey: options.apikey,
            dangerouslyAllowBrowser: true
        });
    }

    override async getCompletion(
      model: Model,  
      systemMessage: string,
      prompt: string,
      taskInstructions: string,
      previousActions: ParsedResponseSuccess[],
      simplifiedDOM: string,
      screenshotAsString: string | null,
      maxAttempts: number,
      notifyError?: (error: string) => void
    ): Promise<ApiResponse> {
      // Implement the OpenAI-specific logic here
      // You should return a valid ApiResponse object
      let completion:any;
      if(model.supportsImages && screenshotAsString){
        completion = await this.api.chat.completions.create({
          model: model.name,
          messages: [
            {
              role: 'system',
              content: systemMessage,
            },
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    "url": screenshotAsString,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
          temperature: 0,
          stop: ['</Action>'],
        });
      }

      else{
        completion = await this.api.chat.completions.create({
        model: model.name,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0,
        stop: ['</Action>'],
      });
    }
   
    const response: ApiResponse = {
        usage: completion.usage,
        prompt,
        rawResponse: completion,
        response:
          completion.choices[0].message?.content?.trim() + '</Action>',
      };
      return response;
    }
  } 