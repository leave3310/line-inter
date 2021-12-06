import express from "express"
import line from "@line/bot-sdk"
import dotenv from "dotenv-flow"
import replyMessage from "./reply.js"
import getUser from './other-user.js'
import attractionsFlex from './attraction/attraction-postback.js'
import getAttractions from './attraction/attractions.js'
dotenv.config()

const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
}

const client = new line.Client(config)
const app = express()

app.post("/callback", line.middleware(config), (req, res) => {
  const userMessage = req.body.events[0]
  const replyToken = req.body.events[0].replyToken
  if (userMessage.type === 'message') {
    if (userMessage.message.text === 'help' || userMessage.message.text === 'Help') {
      client.replyMessage(replyToken, replyMessage)
    } else {
      return client.replyMessage(replyToken, { type: 'text', text: userMessage.message.text });
    }
  } else {
    switch (userMessage.postback.data) {
      case 'user':
        getUser(replyToken, client)
        break
      case 'attractions':
        return client.replyMessage(replyToken, attractionsFlex)
      default:
        getAttractions(replyToken, client, userMessage.postback.data)
    }
  }
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
