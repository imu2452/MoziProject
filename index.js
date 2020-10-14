"use strict";
const line = require("@line/bot-sdk");
const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });
// ①SDKをインポート

const crypto = require("crypto");

let text = 'メニューから選択してください'
let message = {
  type: "text",
  text,
};

const depoText = "文字数を入力してください"
const confText = "残高確認は現在実装中です"
const caleText = "カレンダーは現在実装中です"

//コントローラクラス
exports.handler = function (event, context) {
  let body = JSON.parse(event.body);
  var reply_token = body.events[0].replyToken

  let signature = crypto
    .createHmac("sha256", process.env.CHANNELSECRET)
    .update(event.body)
    .digest("base64");
  let checkHeader = (event.headers || {})["X-Line-Signature"];
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
          console.log('選択メニュー：預金');
          //「預金」を受け取ったとき預金用の関数を呼び出す
          text = depoText;
          message = deposit(text);
          break;
        case '残高確認':
          console.log('選択メニュー：残高確認');
          //「残高確認」を受け取ったときに残高確認用の関数を呼び出す
          text = confText;
          message = confilmation(text);
          break;

        case 'ログイン記録カレンダー':
          console.log('選択メニュー：ログイン記録カレンダー');
          //「ログイン記録」を受け取ったときに記録用カレンダーノブラウザを表示する
          text = caleText;
          message = calender(text);
          break;

        default:
          break;
      }

      rep(reply_token, message);

    }
  } else {
    console.log("署名認証エラー");
  }

};

function rep(reply_token, message) {
  client
    .replyMessage(reply_token, message)
    .then((response) => {
      let lambdaResponse = {
        statusCode: 200,
        headers: { "X-Line-Status": "OK" },
        body: '{"result":"completed"}',
      };
      context.succeed(lambdaResponse);
    })
    .catch((err) => console.log(err));
}

//預金用関数
function deposit(text) {

  const depMessage = {
    type: "text",
    text,
  };

  return depMessage;

  //預金時の入力文字チェック（半角文字のみ許容）呼び出す
  /** 
    let count = body1.events[0].message.text
  
    let depReplyText =
      `平素よりお世話になっております。
  文字数貯金です。
  只今、
  【` + count + `円】
  の入金を確認しました。
  またのご利用、お待ちしております。`;
    const depReplyMessage = {
      type: "devReplyText",
      depReplyText,
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
  */



};

//データ登録の関数を呼び出す





//残高確認用の関数
function confilmation(text) {
  const confilmationRepMessage = {
    type: 'text',
    text,
  }
  return confilmationRepMessage;
};
//データを取得する関数を呼び出す



function calender(text) {
  const calenderRepMessage = {
    type: 'text',
    text,
  }
  return calenderRepMessage;
};

//DBに登録する関数　
//登録に失敗した場合、エラーが出る

