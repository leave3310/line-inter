import express from 'express'
import line from '@line/bot-sdk'
import dotenv from 'dotenv-flow'
import { replyMessage } from './reply.js'
dotenv.config()

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};
// create LINE SDK client
const client = new line.Client(config);
// create Express app
// about Express itself: <https://expressjs.com/>
const app = express();
// register a webhook handler with middleware
// about the middleware, please refer to doc

app.post('/callback', line.middleware(config), (req, res) => {
  console.log(req, res)
  Promise
    .all(req.body.events.map(flex))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});
function flex(event){
  return client.replyMessage(event.replyToken, replyMessage)
}
// event handler
// function handleEvent(event) {
//   if (event.type !== 'message' || event.message.type !== 'text') {
//     // ignore non-text-message event
//     return Promise.resolve(null);
//   }
//   // create a echoing text message
//   const echo = { type: 'text', text: event.message.text };
//   // use reply API
//   return client.replyMessage(event.replyToken, replyMessage);
// }


// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});