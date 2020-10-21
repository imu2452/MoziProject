"use strict";
const line = require("@line/bot-sdk");
const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });
const crypto = require("crypto");

let text = 'メニューから選択してください'
let message = {
  type: "text",
  text,
};

const depoText = "文字数を入力してください"
const confText = "残高確認は現在実装中です"
const caleText = "カレンダーは現在実装中です"

const sheetId = "1RF7bDY-TgnJDMcCkRY4Ov_ujvv5BDQUcfOv3FutO6RA";
// var spreadSheet = getSpreadSeat(sheetId);
// const dataSheet = spreadSheet.getSheetByName("mozi_master_seat");


const numeric = /^[0-9]*$/;

//コントローラクラス
exports.handler = function (event, context) {
  let body = JSON.parse(event.body);
  var replyToken = body.events[0].replyToken

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

      //半角数字を受け取った場合にDB登録処理を行う
      if (operation.match(numeric)) {
        text =
          `平素よりお世話になっております。
      文字数貯金です。
      只今、
      【` + operation + `円】
      の入金を確認しました。
      またのご利用、お待ちしております。`;
        message = createReply(text)
        console.log("預金データを登録");

      } else {

        //メニューから選択された場合
        switch (operation) {
          case '預金':
            console.log('選択メニュー：預金');
            message = createReply(depoText);
            console.log("預金メッセージを送信");
            break;

          case '残高確認':
            console.log('選択メニュー：残高確認');
            //「残高確認」を受け取ったときに残高確認用の関数を呼び出す
            message = createReply(confText);
            console.log("残高を確認");
            break;

          case 'ログイン記録カレンダー':
            console.log('選択メニュー：ログイン記録カレンダー');
            //「ログイン記録」を受け取ったときに記録用カレンダーノブラウザを表示する
            message = createReply(caleText);
            console.log("ログイン記録を確認");
            break;

          default:
            console.log("メニュー以外の操作が選択されました");
            break;
        }
      }
      // sendReplyMessage(replyToken, message);
      client
        .replyMessage(replyToken, message)
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
  } else {
    console.log("署名認証エラー");
  }

};

//返信メッセージを作成する関数
function createReply(text) {
  const repMessage = {
    type: "text",
    text
  };
  return repMessage;

}

