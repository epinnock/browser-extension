chrome.runtime.onMessage.addListener(
   async function(request, sender, sendResponse) {
        console.log('Message received! in background.js');
        const screenshotUrl = await chrome.tabs.captureVisibleTab();
        console.log('screenshotUrl generated! in background.js');
        console.log(screenshotUrl);
        sendResponse({screenshotUrl});
    }
);

/*
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting === "hello")
        sendResponse({farewell: "goodbye"});
    }
  );*/