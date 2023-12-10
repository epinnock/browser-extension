// console.log('This is the background page.');
// console.log('Put the background scripts here.');
chrome.runtime.onMessage.addListener(
   async function(request, sender, sendResponse) {
        console.log('Message received! in background.js');
        const screenshotUrl = await chrome.tabs.captureVisibleTab();
        console.log('screenshotUrl generated! in background.js');
        console.log(screenshotUrl);
        sendResponse({screenshotUrl});
    }
);