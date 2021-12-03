export const replyMessage = {
    "type": "flex",
    "altText": "choose your choice",
    "contents": {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "button",
              "style": "link",
              "height": "sm",
              "action": {
                "type": "postback",
                "label": "get another user",
                "data": "user"
              }
            }
          ]
        }
      }
}




