"use strict";

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, Permission, Suggestions } = require("actions-on-google");

// Import the firebase-functions package for deployment.
const functions = require("firebase-functions");

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent("Default Welcome Intent", conv => {
  // Asks the user's permission to know their name, for personalization.
  conv.ask(
    new Permission({
      context: "Hi there, to get to know you better",
      permissions: "NAME"
    })
  );
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent("actions_intent_PERMISSION", (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`OK, no worries. What's your favorite color?`);
    conv.ask(new Suggestions("Blue", "Red", "Green"));
  } else {
    // If the user accepted our request, store their name in
    // the 'conv.data' object for the duration of the conversation.
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
    conv.ask(new Suggestions("Blue", "Red", "Green"));
  }
});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent("favorite color", (conv, { color }) => {
  const luckyNumber = color.length;
  const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
  if (conv.data.userName) {
    let word = `${conv.data.userName}, your lucky number is ${luckyNumber}`
    let wordWithSound = `<speak>${word} <audio src="${audioSound}"/> </speak>`
    conv.close(wordWithSound)
  } else {
    conv.close("Your second lucky number is " + luckyNumber);
  }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
