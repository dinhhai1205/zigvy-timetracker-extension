// // --------------------------------------------------------------------------------
// chrome.runtime.sendMessage(
//   {
//     type: 'SUBMIT',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   (response) => {
//     console.log(response.message);
//   }
// );
console.log('Content scripts')
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
