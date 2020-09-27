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
      let text = "平素よりお世話になっております。文字数貯金です。/n 只今、" + body.events[0].message.text + "円の入金を確認しました。";
      const message = {
        type: "text",
        text,
      };

      //入力文字チェック関数呼び出し
      //falseの場合、「入力文字は半角英数のみです」をメッセージ送信

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

//返信メッセージを作成する関数
//messageに数字以外が含まれる場合、エラーが出る


//預金時の入力文字チェック（半角文字のみ）


//DBに登録する関数　
//登録に失敗した場合、エラーが出る

