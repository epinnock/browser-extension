import { GET_VISIBLE_TAB } from '../../constants';

const user = {
    username: 'demo-user'
  };
  
chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse)  => {
        // If asking for screenshot send screenshot
        if (message == GET_VISIBLE_TAB) {
          // @ts-expect-error we need to type payload
          const resp = chrome.tabs.captureVisibleTab();
          if (resp instanceof Promise) {
            resp.then((resolvedResp) => {
              console.log(resolvedResp);  
              sendResponse(resolvedResp);
            });
            return true;
          } else {
            sendResponse(resp);
          }
        }
        // 2. A page requested user data, respond with a copy of `user`
        else if (message === 'get-user-data'){
            sendResponse(user);
        }
    }
);