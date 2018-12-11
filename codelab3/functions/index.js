"use strict";

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  BasicCard,
  Carousel,
  Image
} = require("actions-on-google");

// Import the firebase-functions package for deployment.
const functions = require("firebase-functions");

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent("Default Welcome Intent", conv => {
  const name = conv.user.storage.userName;
  if (!name) {
    conv.ask(
      new Permission({
        context: "Hi there, to get to know you better",
        permissions: "NAME"
      })
    );
  } else {
    conv.ask(`Hi again, ${name}. What's your favorite color?`);
  }
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
    // the 'conv.user.storage' object for the duration of the conversation.
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(
      `Thanks, ${conv.user.storage.userName}. What's your favorite color?`
    );
    conv.ask(new Suggestions("Blue", "Red", "Green"));
  }
});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent("favorite color", (conv, { color }) => {
  const luckyNumber = color.length;
  const audioSound =
    "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";
  let moreWord = "Would you like to hear some fake colors?";
  if (conv.user.storage.userName) {
    let word = `${
      conv.user.storage.userName
    }, your lucky number is ${luckyNumber}`;
    let wordWithSound = `<speak>${word} <audio src="${audioSound}"/> ${moreWord} </speak>`;
    conv.ask(wordWithSound);
    conv.ask(new Suggestions("Yes", "No"));
  } else {
    conv.ask(`Your second lucky number is ${luckyNumber}. ${moreWord}`);
    conv.ask(new Suggestions("Yes", "No"));
  }
});

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

// Define a mapping of fake color strings to basic card objects.
const colorMap = {
  "indigo taco": {
    title: "Indigo Taco",
    text: "Indigo Taco is a subtle bluish tone.",
    image: {
      url:
        "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png",
      accessibilityText: "Indigo Taco Color"
    },
    display: "WHITE"
  },
  "pink unicorn": {
    title: "Pink Unicorn",
    text: "Pink Unicorn is an imaginative reddish hue.",
    image: {
      url:
        "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png",
      accessibilityText: "Pink Unicorn Color"
    },
    display: "WHITE"
  },
  "blue grey coffee": {
    title: "Blue Grey Coffee",
    text:
      "Calling out to rainy days, Blue Grey Coffee brings to mind your favorite coffee shop.",
    image: {
      url:
        "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png",
      accessibilityText: "Blue Grey Coffee Color"
    },
    display: "WHITE"
  }
};
// "display" prop is the background color

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

app.intent("actions_intent_NO_INPUT", conv => {
  const repromptCount = parseInt(conv.arguments.get("REPROMPT_COUNT"));
  if (repromptCount === 0) {
    conv.ask("[0] Which color would you like to hear about?");
  } else if (repromptCount === 1) {
    conv.ask("[1] Please say the name of a color");
  } else if (conv.arguments.get("IS_FINAL_REPROMPT")) {
    conv.close(
      "[2] Sorry, we, sir song, are having some trouble. Let's try it again Later. Goodby."
    );
  }
});

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

// In the case the user is interacting with the Action on a screened device
// The Fake Color Carousel will display a carousel of color cards
const fakeColorCarousel = () => {
  const carousel = new Carousel({
    items: {
      "indigo taco": {
        title: "Indigo Taco",
        synonyms: ["indigo", "taco"],
        image: new Image({
          url:
            "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDN1JRbF9ZMHZsa1k/style-color-uiapplication-palette1.png",
          alt: "Indigo Taco Color"
        })
      },
      "pink unicorn": {
        title: "Pink Unicorn",
        synonyms: ["pink", "unicorn"],
        image: new Image({
          url:
            "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png",
          alt: "Pink Unicorn Color"
        })
      },
      "blue grey coffee": {
        title: "Blue Grey Coffee",
        synonyms: ["blue", "grey", "coffee"],
        image: new Image({
          url:
            "https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDZUdpeURtaTUwLUk/style-color-colorsystem-gray-secondary-161116.png",
          alt: "Blue Grey Coffee Color"
        })
      }
    }
  });
  return carousel;
};

// TODO odd! DialogFlow always shows 'webhook err(206) : Dialogflow IntentHandler not found for itnent: yesFavoriteColor'
// TODO so I close the "fulfillment - enable webhook call for this intent" on DialogFlow's console

app.intent("yesFavoriteColor", (conv) => {
  conv.ask("Which color, indigo taco, pink unicorn or blue grey coffee?");
  // If the user is using a screened device, display the carousel
  if (conv.screen) return conv.ask(fakeColorCarousel());
});

app.intent("favorite fake color", (conv, { fakeColor }) => {
  // "favorite fake color" intent handles one event called "actions_intent_OPTION"
  fakeColor = conv.arguments.get("OPTION") || fakeColor;
  conv.ask("Here is the color", new BasicCard(colorMap[fakeColor]));
  if (!conv.screen) {
    conv.ask(colorMap[fakeColor].text);
  }
});

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
