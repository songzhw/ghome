const { dialogflow } = require("actions-on-google");
const functions = require("firebase-functions");
const app = dialogflow({ debug: true });

app.intent('manu music', (conv, {playbackOne}) => {
    conv.close(`here is the playback ${playbackOne}`)
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
