const express       = require('express');
const cors          = require('cors');
const functions     = require('firebase-functions');
const admin         = require('firebase-admin');
const bodyParser    = require('body-parser');

admin.initializeApp(functions.config().firebase);

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

const app = express();
app.use(cors({origin : true}));
app.use(bodyParser())
app.post('/to', (req, res) => {
    const token = req.body.token;
    const body = req.body.message;
    const title = req.body.title;
    const data = req.body.data||{};
    const payload = {
        notification : {
            title,body
        },
        data : data,
    };
    const sended = admin.messaging().sendToDevice(token, payload)
        .then(reponse => {
            return res.send({ message : "sended!", token })
        })
        .catch(response => {
            return res.send({ message : "error!", data : response, token, payload })
        });
});

/*
const sender = "";
    const senderName = "";
    const recipient = "";
    const token = "";
    const payload = {
        notification : {
            title:"",
            body : "",
            sound : "",
            badge : "",
        },
    };
    return ;
*/

exports.sendPushNotification = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
