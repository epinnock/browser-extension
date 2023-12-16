import {
  ParsedResponseSuccess,
} from '../helpers/parseResponse';
  
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


  export default abstract class ResponseProvider {
    protected url?: string;
    protected apikey?: string;
  
    constructor(url?: string, apikey?: string) {
      this.url = url;
      this.apikey = apikey;
    }

    abstract async function getCompletion(
      model: Model,
      systemMessage: string,
      taskInstructions: string,
      previousActions: ParsedResponseSuccess[],
      simplifiedDOM: string,
      screenshotAsString: string | null,
      maxAttempts:number,
      notifyError?: (error: string) => void,
    ):Promise<ApiResponse>
  }
  