"use strict";
const line = require("@line/bot-sdk");
const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });
// ①SDKをインポート

const crypto = require("crypto");

exports.handler = function (event, context) {
  let body = JSON.parse(event.body);
  let signature = crypto
    .createHmac("sha256", process.env.CHANNELSECRET)
    .update(event.body)
    .digest("base64");
  let checkHeader = (event.headers || {})["X-Line-Signature"];

  if (signature === checkHeader) {
    // ②cryptoを使ってユーザーからのメッセージの署名を検証する


    if (body.events[0].replyToken === "00000000000000000000000000000000") {
      let lambdaResponse = {
        statusCode: 200,
        headers: { "X-Line-Status": "OK" },
        body: '{"result":"connect check"}',
      };
      context.succeed(lambdaResponse);
      // ③接続確認エラーを確認する。

    } else {
      let text = body.events[0].message.text;
      const message = {
        type: "text",
        text,
      };
      client
        .replyMessage(body.events[0].replyToken, message)
        .then((response) => {
          let lambdaResponse = {
            statusCode: 200,
            headers: { "X-Line-Status": "OK" },
            body: '{"result":"completed"}',
          };
          context.succeed(lambdaResponse);
        })
        .catch((err) => console.log(err));
      // ④リクエストとして受け取ったテキストをそのまま返す

    }
  } else {
    console.log("署名認証エラー");
  }
};