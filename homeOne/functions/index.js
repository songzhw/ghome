const { dialogflow, Suggestions } = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });

app.intent('manu music', (conv, {playbackOne}) => {
    let audioSrc = "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3"
    var resultStr = `<speak>music ${playbackOne}: <audio src=${audioSrc}/> </speak>`;
    conv.ask(resultStr)
    conv.ask(new Suggestions('Got it', "No, thanks"))
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
