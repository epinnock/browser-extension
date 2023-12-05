



// New method to capture the current tab
export async function captureTab() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tab = tabs[0];
        if (!tab) {
          return reject(new Error("No active tab found"));
        }
  
        chrome.tabs.captureVisibleTab(tab.windowId, {format: "png"}, (dataUrl) => {
          if (chrome.runtime.lastError) {
            return reject(new Error(chrome.runtime.lastError.message));
          }
          console.log('captured tab')
          console.log(dataUrl)

          resolve(dataUrl);
        });
      });
    });
  }
  