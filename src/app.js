import express from "express"
import line from "@line/bot-sdk"
import dotenv from "dotenv-flow"
import replyMessage from "./reply.js"
import getUser from './other-user.js'
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
  
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
