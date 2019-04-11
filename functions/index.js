const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const toUpperCase = string => string.toUpperCase();

exports.addMessage = functions.https.onRequest((request, response) => {
    const text = request.query.text;
    const secretText = toUpperCase(`The messge: ${text}`);

    admin.database()
        .ref('/messages/data')
        .push({text : secretText})
        .then(() => response.json({ message : 'great', secretText}))
        .catch(() => response.json({message : 'Bad request!'}))
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
