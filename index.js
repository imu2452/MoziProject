"use strict";
const line = require("@line/bot-sdk");
const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });
// ①SDKをインポート

const crypto = require("crypto");

//コントローラクラス
exports.handler = function (event, context) {
  let body = JSON.parse(event.body);
  let signature = crypto
    .createHmac("sha256", process.env.CHANNELSECRET)
    .update(event.body)
    .digest("base64");
  let checkHeader = (event.headers || {})["X-Line-Signature"];
  /**
   * 
   */

  let operation = body.events[0].message.text

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

      switch (operation) {
        case '預金':
          //「預金」を受け取ったとき預金用の関数を呼び出す
          deposit(body);
          break;

        case '残高確認':
          //「残高確認」を受け取ったときに残高確認用の関数を呼び出す
          confilmation(body);
          break;

        case 'ログイン記録カレンダー':
          //「ログイン記録」を受け取ったときに記録用カレンダーノブラウザを表示する
          calender(body);

          break;

        default:
      }
    }
  } else {
    console.log("署名認証エラー");
  }

};


//預金用関数
function deposit(body) {
  let depText =
    '入金額を半角数字で入力してください'
  const depMessage = {
    type: "text",
    depText,
  };
  client
    .replyMessage(body.events[0].replyToken, depMessage)

  let count = body.events[1].message.text

  //預金時の入力文字チェック（半角文字のみ許容）呼び出す

  let depReplyText =
    `平素よりお世話になっております。
文字数貯金です。
只今、
【` + count + `円】
の入金を確認しました。
またのご利用、お待ちしております。`;
  const depReplyMessage = {
    type: "text",
    text,
  };

  client
    .replyMessage(body.events[0].replyToken, depReplyMessage)
    .then((response) => {
      let lambdaResponse = {
        statusCode: 200,
        headers: { "X-Line-Status": "OK" },
        body: '{"result":"completed"}',
      };
      context.succeed(lambdaResponse);
    })
    .catch((err) => console.log(err));



};

//データ登録の関数を呼び出す





//残高確認用の関数
function confilmation(body) {
  let confilmationRepText = '残高確認は現在実装中です'
  const confilmationRepMessage = {
    type: 'text',
    text,
  }
  client.replyMessage(body.events[0].replyToken, confilmationRepMessage)

};
//データを取得する関数を呼び出す



function calender(body) {
  let calenderrepText = 'カレンダーは現在実装中です'
  const calenderRepMessage = {
    type: 'text',
    calenderrepText,
  }
  client.replyMessage(body.events[0].replyToken, calenderRepMessage)
};

//DBに登録する関数　
//登録に失敗した場合、エラーが出る

