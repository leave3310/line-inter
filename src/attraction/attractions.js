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

export default async function getAttractions(token, client, position) {
  const res = await axios.get(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${position}?$format=JSON`, {
    headers: getAuthorizationHeader()
  })

  console.log(res.data);

  return client.replyMessage(token, { type: 'text', text: 'aa' })
}