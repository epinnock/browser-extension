  type ApiResponse = {
    usage: string;
    prompt: string;
    rawResponse: string;
    response: string;
  };

  abstract class ResponseProvider {
    abstract async function getCompletion(
      taskInstructions: string,
      previousActions: ParsedResponseSuccess[],
      simplifiedDOM: string,
      screenshotAsString: string | null,
      maxAttempts:number,
      notifyError?: (error: string) => void,
    ):ApiResponse
  }
  