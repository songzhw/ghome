const {
  dialogflow,
  Suggestions,
  MediaObject,
  Image,
  SimpleResponse
} = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });

const version = 24;

var offset = 0;
var intervalId = 0;

app.intent("Default Welcome Intent", conv => {
  offset = conv.user.storage.offset;
  let start = `version ${version}. Welcome`;
  if (offset) {
    conv.ask(`${start}. the offset we just saved is ${offset}`);
  } else {
    conv.ask(`${start}. we don not have any offest saved`);
  }
});

app.intent("manu music", (conv, { playbackOne, company }) => {
  let audioSrc = "https://s3.ca-central-1.amazonaws.com/test-audiobooks/sample.mp3";
  let from = offset;
  let resultStr = `<speak>${playbackOne}<audio src="${audioSrc}" clipBegin="${from}s"/> </speak>`;
  conv.ask(resultStr);
  conv.ask(new Suggestions("Got it", "No, thanks"));

  intervalId = setInterval(() => (offset = offset + 1), 1000);
});

app.intent("leave conv", conv => {
  conv.user.storage.offset = offset - 13;
  clearInterval(intervalId);
  offset = 0;
  conv.close(`offset = ${conv.user.storage.offset}`);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
