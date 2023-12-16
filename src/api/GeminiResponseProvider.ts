class GeminiResponseProvider extends ResponseProvider {
    constructor(url?: string, apikey?: string) {
        super(url, apikey);
        }
    async getCompletion(
      model: Model,
      taskInstructions: string,
      previousActions: ParsedResponseSuccess[],
      simplifiedDOM: string,
      screenshotAsString: string | null,
      maxAttempts: number,
      notifyError?: (error: string) => void
    ): Promise<ApiResponse> {
      // Implement the Gemini-specific logic here
      // You should return a valid ApiResponse object
      const response: ApiResponse = {
        usage: "Gemini",
        prompt: taskInstructions,
        rawResponse: "Gemini raw response",
        response: "Gemini response",
      };
      return response;
    }
  }