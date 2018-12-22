const { dialogflow, Suggestions, MediaObject, Image, SimpleResponse } = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });

app.intent('manu music', (conv, {playbackOne}) => {
  if (!conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO')) {
    conv.ask('Sorry, this device does not support audio playback.');
    return;
  }
  conv.ask(`okay, let's ${playbackOne}`)
  conv.ask(new SimpleResponse("I am Simple Reponse"))
  conv.ask(new Suggestions("Yes","No"))
  conv.close(new MediaObject({
    name: 'Jazz in Paris',
    url: 'https://s1.vocaroo.com/media/download_temp/Vocaroo_s1cJCrKVFdol.mp3',
    description: 'A funky Jazz tune',
    icon: new Image({
      url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
      alt: 'Ocean view',
    }),
  }));
})
// https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3  : streaming type, 01:42 long
// https://s1.vocaroo.com/media/download_temp/Vocaroo_s1cJCrKVFdol.mp3: streaming type, 15:05 long

// app.intent('manu music', (conv, {playbackOne, company}) => {
//     // let audioSrc = "https://s1.vocaroo.com/media/download_temp/Vocaroo_s1aKfXwJUaLz.mp3"  // music: < 120s
//     let audioSrc = "https://s1.vocaroo.com/media/download_temp/Vocaroo_s12PH97aukdO.mp3" // audiobook : > 120s. And <speak> plays the whole 3:06s
// let resultStr = `<speak>${playbackOne} on ${company}<audio src="${audioSrc}"/> </speak>`;
//     conv.ask(resultStr)
//     conv.ask(new Suggestions('Got it', "No, thanks"))
// })


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);