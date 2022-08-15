import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const app = express();

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');

    if('OPTIONS' == req.method){
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`);
        next();
    }
});

app.get('/getData', async (req, res) =>{
    const client = await authorize();
    const messageID = await getID(client as OAuth2Client, 0);
    const message = await getMessage(client as OAuth2Client, messageID as string);
    res.send([message]);
});

app.listen(4201, '127.0.0.1', function(){
    console.log('Server is listening on 4201');
});


//Gmail API setup


import {google} from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const token = require('./token.json');
const credentials = require('./credentials.json');


/*
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content.toString()), start);
});
*/

function authorize() {
  return new Promise((resolve, reject) => {
    try{
      const {client_secret, client_id, redirect_uris} = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

      oAuth2Client.setCredentials(token);
      resolve(oAuth2Client);
    } catch {
      reject();
    }
  });
}

function getID(auth: OAuth2Client, index: number) {
  return new Promise((resolve, reject) =>{
    const gmail = google.gmail({version: 'v1', auth});
    // Find ID of message given index starting from latest message
    gmail.users.messages.list({
      userId: 'me',
      maxResults: index+1,
    }, (err, res) => {
      if (err) reject("API ERROR");
      const messages = res?.data?.messages;
      if (messages && messages.length) {
        var messageID = messages[index].id;
        resolve(messageID);
      } else {
        reject("No messages found");
      }
    });
  });
}

function getMessage(auth: OAuth2Client, messageID: string){
  return new Promise((resolve, reject) => {
    const gmail = google.gmail({version: 'v1', auth});
    //Retrieve message from ID
    gmail.users.messages.get({
      userId: 'me',
      id: messageID,
    }, (err, res) => {
      if (err) reject("API ERROR");

      let data = "";
      let subject = "";
      //Gmail API JSON objects are not standardized for where message data can be found, try both:
      //This sucks (checking for null)
      if(res && res.data && res.data.payload && res.data.payload.parts && res.data.payload.headers){ //Plain text emails
        const messageBody = res?.data?.payload?.parts[0]?.body?.data ?? "";
        const messageHeaders = res?.data?.payload?.headers;
        let messageSubject = "";
        for(const obj of messageHeaders){
          if(obj.name == "Subject"){
            messageSubject = obj.value ?? "";
          }
        }
        data = JSON.stringify(messageBody);
        subject = messageSubject;
      }
      else if(res && res.data && res.data.payload && res.data.payload.body && res.data.payload.headers){ //Heavily formated emails
        const messageBody = res?.data?.payload?.body?.data ?? "";
        const messageHeaders = res?.data?.payload?.headers;
        let messageSubject = "";
        for(const obj of messageHeaders){
          if(obj.name == "Subject"){
            messageSubject = obj.value ?? "";
          }
        }
        data = JSON.stringify(messageBody);
        subject = messageSubject;
      }

      let buffer = Buffer.from(data, "base64");
      var messageString = buffer.toString();
      const apiResponse = {"subject": subject, "body" : messageString}
      resolve(apiResponse);
    });

  });
}
