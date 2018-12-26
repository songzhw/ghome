const {
  dialogflow,
  Suggestions,
  MediaObject,
  Image,
  SimpleResponse
} = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });

const version = 26;
app.intent("Default Welcome Intent", conv => {
  let offset = conv.user.storage.offset;
  let start = `version ${version}. Welcome`;
  if (offset) {
    conv.ask(`${start}. the offset we just saved is ${offset}`);
  } else {
    conv.ask(`${start}. we don not have any offest saved`);
  }
});

// app.intent("manu music", (conv, { playbackOne }) => {
//   conv.ask(new SimpleResponse(`version ${version}`));

//   conv.ask(
//     new MediaObject({
//       name: "Jazz in Paris",
//       url: "https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
//       description: "A funky Jazz tune",
//       icon: new Image({
//         url: "https://storage.googleapis.com/automotive-media/album_art.jpg",
//         alt: "Ocean view"
//       })
//     })
//   );

//   conv.ask(new Suggestions("Yes", "No"));
// });
// https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3  : streaming type, 01:42 long
// https://s1.vocaroo.com/media/download_temp/Vocaroo_s1cJCrKVFdol.mp3: streaming type, 15:05 long
// https://s3.ca-central-1.amazonaws.com/test-audiobooks/sample.mp3 : streaming type, 1:12:55

app.intent("manu music", (conv, { playbackOne, company }) => {
  let audioSrc = "https://s3.ca-central-1.amazonaws.com/test-audiobooks/sample.mp3";
  let resultStr = `<speak>${playbackOne} on ${company}<audio src="${audioSrc}" clipBegin="100s"/> </speak>`;
  conv.ask(resultStr);
  conv.ask(new Suggestions("Got it", "No, thanks"));
});

// // It seems it only says the word when the playing is finished
// app.intent("MEDIA_STATUS", conv => {
//   const mediaStatus = conv.arguments.get("MEDIA_STATUS");
//   if (mediaStatus) {
//     conv.ask(`playback status = ${mediaStatus.status}`);
//   } else {
//     conv.ask("empty status ");
//   }
// });

app.intent("leave conv", conv => {
  // TODO get the offset from the playback
  let savedOffset = Math.floor(Math.random() * 100);
  conv.user.storage.offset = savedOffset;
  conv.close(
    `Let me know when you want to resume this audio book : ${
      conv.user.storage.offset
    }`
  );
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
