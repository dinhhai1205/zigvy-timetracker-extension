// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('From content script')
  if (request.type === 'SUBMIT') {
    console.log(request);

    sendResponse({
      message: 'Thanks',
    });
  }
});
