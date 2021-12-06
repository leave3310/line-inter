import jsSHA from 'jssha/sha1';
import axios from 'axios';

function getAuthorizationHeader() {
  const AppID = process.env.AppID
  const AppKey = process.env.AppKey
  const GMTString = new Date().toGMTString();

  const shaObj = new jsSHA("SHA-1", "TEXT", {
    hmacKey: { value: AppKey, format: "TEXT" },
  });

  shaObj.update('x-date: ' + GMTString);
  const hmac = shaObj.getHash("B64");

  const Authorization = `hmac username=\"${AppID}\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"${hmac}\"`;
  return { 'Authorization': Authorization, 'X-Date': GMTString };
}

function regPhone(phone) {
  return `0${phone.slice(4)}`
}

function replaceUndefine(val) {
  return !val ? "沒有資訊" : val
}

function heroUrlHasVal(val) {
  return !val ? "https://www.moedict.tw/%E6%B2%92%E6%9C%89.png" : val
}


export default async function getAttractions(token, client, position) {
  const res = await axios.get(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${position}?$top=5`, {
    headers: getAuthorizationHeader()
  })
  const data = res.data
  const flex = []

  data.forEach(item => {
    flex.push({
      "type": "flex",
      "altText": "attractionFlex",
      "contents": {
        "type": "bubble",
        "size": "giga",
        "hero": {
          "type": "image",
          "url": heroUrlHasVal(item.Picture.PictureUrl1),
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": replaceUndefine(item.Name),
              "weight": "bold",
              "size": "xl"
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "none",
                  "contents": [
                    {
                      "type": "text",
                      "text": "連絡電話",
                      "color": "#aaaaaa",
                      "size": "md",
                      "flex": 2
                    },
                    {
                      "type": "text",
                      "text": replaceUndefine(regPhone(item.Phone)),
                      "wrap": true,
                      "color": "#666666",
                      "size": "md",
                      "flex": 5
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "none",
                  "contents": [
                    {
                      "type": "text",
                      "text": "開放時間",
                      "color": "#aaaaaa",
                      "size": "md",
                      "flex": 2
                    },
                    {
                      "type": "text",
                      "text": replaceUndefine(item.OpenTime),
                      "wrap": true,
                      "color": "#666666",
                      "size": "md",
                      "flex": 5
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "none",
                  "contents": [
                    {
                      "type": "text",
                      "text": "簡介說明",
                      "color": "#aaaaaa",
                      "size": "md",
                      "flex": 2
                    },
                    {
                      "type": "text",
                      "text": replaceUndefine(item.DescriptionDetail),
                      "wrap": true,
                      "color": "#666666",
                      "size": "md",
                      "flex": 5
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    })
  })

  return client.replyMessage(token, flex)
}