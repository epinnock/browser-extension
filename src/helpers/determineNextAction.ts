import OpenAI from 'openai';

import { useAppState } from '../state/store';
import { availableActions } from './availableActions';
import { ParsedResponseSuccess } from './parseResponse';
import { GEMINI_PROVIDER, OPENAI_PROVIDER, ResponseProvider} from '../api/ResponseProvider';
import OpenAIResponseProvider  from '../api/OpenAIResponseProvider';
import GeminiResponseProvider  from '../api/GeminiResponseProvider';

const formattedActions = availableActions
  .map((action, i) => {
    const args = action.args
      .map((arg) => `${arg.name}: ${arg.type}`)
      .join(', ');
    return `${i + 1}. ${action.name}(${args}): ${action.description}`;
  })
  .join('\n');

const systemMessage = `
You are a browser automation assistant.

You can use the following tools:

${formattedActions}

You will be be given a task to perform and the current state of the DOM. You will also be given previous actions that you have taken. You may retry a failed action up to one time.

This is an example of an action:

<Thought>I should click the add to cart button</Thought>
<Action>click(223)</Action>

You must always include the <Thought> and <Action> open/close tags or else your response will be marked as invalid.`;

export async function determineNextAction(
  taskInstructions: string,
  previousActions: ParsedResponseSuccess[],
  simplifiedDOM: string,
  screenshotAsString: string | null,
  maxAttempts = 3,
  
  
  notifyError?: (error: string) => void,
) {
  //Todo: change the model store in the state to be the json not the name
  const model = useAppState.getState().settings.selectedModel;
  const openAIKey = useAppState.getState().settings.openAIKey;
  const geminiKey = useAppState.getState().settings.geminiKey;

  const prompt = formatPrompt(taskInstructions, previousActions, simplifiedDOM);

  if(!model){
    notifyError?.('No model selected');
    return null;
  }



  for (let i = 0; i < maxAttempts; i++) {
    try {
        // perform completion based on the current model
       // perform completion based on the current model
       let provider:ResponseProvider;
       switch(model.provider){
        case OPENAI_PROVIDER:
          if (!openAIKey) {
            notifyError?.('No API key found');
            return null;
          }
          provider = new OpenAIResponseProvider({apikey:openAIKey!!});
          break;
       
        case GEMINI_PROVIDER:
          if (!geminiKey) {
            notifyError?.('No API key found');
            return null;
          }
          provider = new GeminiResponseProvider({apikey:geminiKey!!});
          break;
        default:
          throw new Error(`Unknown model provider ${model.provider}`);
      }
      const completion = await provider.getCompletion(
        model!!,
        systemMessage,
        prompt,
        taskInstructions,
        previousActions,
        simplifiedDOM,
        screenshotAsString,
        maxAttempts,
        notifyError
      );
      return completion;
    } catch (error: any) {
      console.log('determineNextAction error', error);
      if (error.response.data.error.message.includes('server error')) {
        // Problem with the OpenAI API, try again
        if (notifyError) {
          notifyError(error.response.data.error.message);
        }
      } else {
        // Another error, give up
        throw new Error(error.response.data.error.message);
      }
    }
  }
  throw new Error(
    `Failed to complete query after ${maxAttempts} attempts. Please try again later.`
  );
}

export function formatPrompt(
  taskInstructions: string,
  previousActions: ParsedResponseSuccess[],
  pageContents: string
) {
  let previousActionsString = '';

  if (previousActions.length > 0) {
    const serializedActions = previousActions
      .map(
        (action) =>
          `<Thought>${action.thought}</Thought>\n<Action>${action.action}</Action>`
      )
      .join('\n\n');
    previousActionsString = `You have already taken the following actions: \n${serializedActions}\n\n`;
  }

  return `The user requests the following task:

${taskInstructions}

${previousActionsString}

Current time: ${new Date().toLocaleString()}

Current page contents:
${pageContents}`;
}
