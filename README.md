

# Fulcrum: Full Browser Automation with Vision Support

Fulcrum, a fork of the original Taxy AI project, harnesses the power of GPT-4 along with advanced vision models such as GPT4-Vision-Turbo and Gemini Pro to control your browser and perform a wide array of tasks. These enhancements allow Fulcrum to interpret and interact with both textual and visual content on web pages, offering a more dynamic and versatile automation experience.
The Chrome Plugin, a key component of Fulcrum, now features screenshot functionality. It captures the current visible screen, integrating these screenshots into the prompts sent to Fulcrum. This allows for more accurate and context-aware automation based on visual information.
￼

Fulcrum uses LLMs to control your browser and perform repetitive actions on your behalf. Currently it allows you to define ad-hoc text instructions.


Fulcrum is fully open-source, and requires users to bring their keys, ultimately we would like to move to hosting our own models using cogagent/llava .

<img src="src/assets/img/fulcrum_128.png" width="64"/>

## Table of Contents

- [Fulcrum: Full Browser Automation](#fulcrum-full-browser-automation-with-vision-support)
  - [Table of Contents](#table-of-contents)
  - [Installing and Running](#installing-and-running)
    - [Installing the extension](#installing-the-extension)
    - [Running in your browser](#running-in-your-browser)
  - [How it Works - The Action Cycle](#how-it-works---the-action-cycle)
  - [Tech Stack](#tech-stack)
  - [Resources](#resources)

## Installing and Running

Currently this extension is only available through this GitHub repo. We'll release it on the Chrome Web Store after adding features to increase its usability for a non-technical audience. To build and install the extension locally on your machine, follow the instructions below.

### Installing the extension

1. Ensure you have [Node.js](https://nodejs.org/) >= **16**.
2. Clone this repository
3. Run `yarn` to install the dependencies
4. Run `yarn start` to build the package
5. Load your extension on Chrome by doing the following:
   1. Navigate to `chrome://extensions/`
   2. Toggle `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder that `yarn start` generated

### Running in your browser

1. Once installed, the browser plugin will be available in two forms:
   1. As a Popup. Activate by pressing `cmd+shift+y` on mac or `ctrl+shift+y` on windows/linux, or by clicking the extension logo in your browser.
   2. As a devtools panel. Activate by first opening the browser's developer tools, then navigating to the `Taxy AI` panel.
2. The next thing you need to do is create or access an existing [OpenAI API Key](https://platform.openai.com/account/api-keys) and paste it in the provided box. This key will be stored securely in your browser, and will not be uploaded to a third party.
3. Finally, navigate to a webpage you want Taxy to act upon (for instance the [OpenAI playground](https://platform.openai.com/playground)) and start experimenting!

## How it Works - The Action Cycle

1. Taxy runs a content script on the webpage to pull the entire DOM. It simplifies the html it receives to only include interactive or semantically important elements, like buttons or text. It assigns an id to each interactive element. It then "templatizes" the DOM to reduce the token count even further.
2. Taxy sends the simplified DOM, along with the user's instructions, to a selected LLM (currently GPT-3.5 and GPT-4 are supported). Taxy informs the LLM of two methods to interact with the webpage:
   1. `click(id)` - click on the interactive element associated with that id
   2. `setValue(id, text)` - focus on a text input, clear its existing text, and type the specified text into that input
3. When Taxy gets a completion from the LLM, it parses the response for an action. The action cycle will end at this stage if any of the following conditions are met:
   1. The LLM believes the task is complete. Instead of an action, the LLM can return an indication that it believes the user's task is complete based on the state of the DOM and the action history up to this point.
   2. The user stopped the task's execution. The user can stop the LLM's execution at any time, without waiting for it to complete.
   3. There was an error. Taxy's safety-first architecture causes it to automatically halt execution in the event of an unexpected response.
4. Taxy executes the action using the [chrome.debugger API](https://developer.chrome.com/docs/extensions/reference/debugger/).
5. The action is added to the action history and Taxy cycles back to step 1 and parses the updated DOM. All prior actions are sent to the LLM as part of the prompt used to determine the next action. Taxy can currently complete a maximum of 50 actions for a single task, though in practice most tasks require fewer than 10 actions.



## Tech Stack

Technology currently used by this extension:

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/)
- [React 17](https://reactjs.org)
- [Webpack 5](https://webpack.js.org/)
- [Webpack Dev Server 4](https://webpack.js.org/configuration/dev-server/)
- [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app)
- [Prettier](https://prettier.io/)
- [TypeScript](https://www.typescriptlang.org/)

## Resources

- [Getting Started with Chrome Extensions](https://developer.chrome.com/extensions/getstarted)
