import {
  ParsedResponseSuccess,
} from '../helpers/parseResponse';

  export const OPENAI_PROVIDER = 'OpenAI';
  export const GEMINI_PROVIDER = 'Gemini';

  export interface ResponseProviderOptions {
    url?: string;
    apikey?: string;
  }
  

  export type ApiResponse = {
    usage: string;
    prompt: string;
    rawResponse: string;
    response: string;
  };

  export type Model = {
    provider: string;
    name: string;
    displayName: string;
    supportsImages: boolean;
  }


  export  abstract class ResponseProvider {
    protected url?: string;
    protected apikey?: string;
  
    constructor(options: ResponseProviderOptions = {}) {
      this.url = options.url;
      this.apikey = options.apikey;
    }

    abstract getCompletion(
      model: Model,
      systemMessage: string,
      prompt: string,
      taskInstructions: string,
      previousActions: ParsedResponseSuccess[],
      simplifiedDOM: string,
      screenshotAsString: string | null,
      maxAttempts:number,
      notifyError?: (error: string) => void,
    ):Promise<ApiResponse>
  }
  