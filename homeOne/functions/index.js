const { dialogflow, Suggestions, MediaObject, Image } = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });

// app.intent('manu music', (conv, {playbackOne}) => {
//   if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
//     conv.ask('Sorry, this device does not support audio playback.');
//     return;
//   }
//   conv.ask(`okay, let's ${playbackOne}`)
//   conv.ask(new MediaObject({
//     name: 'Jazz in Paris',
//     url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
//     description: 'A funky Jazz tune',
//     icon: new Image({
//       url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
//       alt: 'Ocean view',
//     }),
//   }));
// })

app.intent('manu music', (conv, {playbackOne}) => {
    let audioSrc = "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3"
    let resultStr = `<speak>${playbackOne} <audio src="${audioSrc}"/> </speak>`;
    conv.ask(resultStr)
    conv.ask(new Suggestions('Got it', "No, thanks"))
})


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
