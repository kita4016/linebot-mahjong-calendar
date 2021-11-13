const functions = require("firebase-functions");
const express = require("express");
const app = express();
const Calendar = require("node-google-calendar");
const line = require("@line/bot-sdk");
const config = {
  channelAccessToken: "rmAhXJKX8Tykrs/6zb32qA1iBauB8+PwGhFFJ3d7IX3X6SNWB7spULkySEsNZbxKVrbYhQ4+sBGf00MLRfK4rZaraJYhYZ00DVnwYpskBIhEaaXsNzVWcQnI9fw5Ao6BMgrYNCT6lY3eT/F0pFBUHAdB04t89/1O/w1cDnyilFU=+ouPIKYeSkxUR9MwIMofaUiXadK2JIEJxVhweZM+09NY7kBPT2C7Ht4DONrItSmzegxW/z9m21esdE2w3yF8nYAAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "f5798a8f1f246aff45b42ea80174bf0e",
};
const client = new line.Client(config);

const CALENDAR_CONFIG = {
    serviceAcctId: "mahjong-calendar-211030@my-project-linebot-211030.iam.gserviceaccount.com",
    calendarId: {"mayCal": "bit0tak5bl4eqfua3jpedt0iug@group.calendar.google.com"},
    key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXsy1wjR9U7UHq\npnDBq3vwL514kBkPMwUjoG4IFQGjVVyLowfRFQpenRWBI3gjLBtOG6DFtmhzRihG\nl4Sv9zvkpxRZjJTf2CcWMHN5xBVXzDKWSdPsssCMskfEIxacKCz+umEzsq/WOHP/\noDrGWJpNbPc3QfDboi2D2DQh9YXxC7xW2oOrFogs9EZUHhMGjvwrDP2OmVAexoxQ\nD1naDJkkKKtU5Y1NqElZNaq0E0P9AkalSr9KM/B7kfl4iV5cY7rpLVuPtg03gM4R\nenHSU9jKwO0C8i2GHeTqlhglEuVlNVEd6HQX27/da9Yp3UY729N8PCYGIsdh/ctA\n3LPYjVldAgMBAAECggEAGxq7mMNO/tnCePU5wYhmLlAZalM3JusLGAc6lF7pYggh\ntTVDD/GkKC/2ig/2MntCIh5EJVwOw397I6W6CW+Ykdqx6q/I7Fjpzna/p/stEGeL\nKsnzrLBolDV54apkFrLQtqCegsPPJyzYXLSadh6fox+QcBvj44F9VS43nNXQozGS\nZxqSRWSG5q8w4MMBCFQOs0qbW2FNGiK2F3I45e3f++YbMUx1zyDi/g9nCGmBdmAH\nf59CcihCBZDf3lmyoU5KIVIADa7YhheTPokbIISeHLcuN80a/fsWjYDRIPcJ326h\nYDC305XSP2Jb2diEolCsgIX5gqCdGQrBS/77n5sdwQKBgQD6j/B95FVk31wlukx5\nk9q1TysNS4Hbm5ab60csoTeOlpxGX1fCo+Q+5t0ZUdXqTr3WhcXczBy6BdnPV1l9\nUTO3siY35G9U6YPKdL9hIYBm7js2XbiyRRbp8PEVivAxUqto7M67DBQIg/x2wtHe\np1SUblSJ6XzOk57pLa6ID3p5HQKBgQDcYY06MjGLB7XX8GeEeGXcnLDjXp77e0Yg\nlmKfuN3PZVANyCPy2rxJ9O7pcLV8UGlbPImZk07nwYCRy0d1VL0+148g4ZQiBZoO\nqucb3LwkUKplmOmI9c//BXIaWchXf+QV2NRGxc0dY+BovsffBG+IkPimz19sWvQN\nwCQqWkytQQKBgBjnia3ZrisykEQnukYzTf/LeKn/oU6krlmdDxv+gjkn+yx7eYud\nIqil5cAIhEyfuvrBnSMPHqPWxQl40ypDkfJmQKo5iF9WPoU3CXasD8krULNcqWj+\nuQJTsoLDppAgeW0abInm727RP5zGTHnnA98lAD4c+QzHW3ot0jUv5Kp5AoGBAIP7\nhEnzH4qlDnmJh2VleZOa37D7zPjNRh1kEyKW43g+s6fdUfIyn4snPiHeF0KhIce7\nRKkN+LaBQ4+ND3msSz4keJp3nnCVrELWhVxBYQfaq4H3Bv24QV34k/JGDN6iQCX5\nWoAcHBBa7V2tzCO7E1TVhaTZEsvg2MKXbNFUjRFBAoGAM3HqHJ2deg+KWH8jjTzn\nnIrTUJT6T5P1ENJcCDnmmTHQn4XoI/ya1OvNOdi42TrQrJvk3yYU16uRcQul2E4E\nmMBEZUb/OOLX/2CdyikbM3lKtfGp4niYyRnmd1k9wpWTdV7GYjuJQkmBSiDKVj9K\nHozy49OVZFJUgi9+YWPalUk=\n-----END PRIVATE KEY-----\n",
    timezone: "UTC+09:00",
  };
  // カレンダーインスタンス化
  const cal = new Calendar(CALENDAR_CONFIG);
  
  app
      .post("/hook", line.middleware(config), (req, res)=> lineBot(req, res));
  
  const lineBot = (req, res) => {
    res.status(200).end();
    const events = req.body.events;
    const promises = [];
    for (let i=0; i<events.length; i++) {
      const ev = events[i];
      console.log(ev);
      for (let i=0; i<events.length; i++) {
        const ev = events[i];
        // イベントタイプにより仕分け
        switch (ev.type) {
          // 友達登録
          case "follow":
            promises.push(handleFollowEvent(ev));
            break;
          // メッセージイベント
          case "message":
            promises.push(handleMessageEvent(ev));
            break;
          // ポストバックイベント
          case "postback":
            promises.push(handlePostbackEvent(ev));
            break;
          default:
            return;
        }
      }
    }
    Promise
        .all(promises)
        .then(console.log("all promises passed"))
        .catch((e) => console.error(e.stack));
  };
  
  const handleMessageEvent = (ev) => {
    const text = ev.message.text;
    if (text === "はじめまして") {
      const flexMessage = {
        "type": "flex",
        "altText": "テストメッセージ",
        "contents": {
          "type": "bubble",
          "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "はじめまして",
                "size": "3xl",
                "align": "center",
              },
            ],
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "datetimepicker",
                  "label": "日時選択",
                  "data": "date",
                  "mode": "datetime",
                },
              },
            ],
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "message",
                  "label": "はい",
                  "text": "YES",
                },
              },
              {
                "type": "button",
                "action": {
                  "type": "postback",
                  "label": "いいえ",
                  "data": "no",
                },
              },
            ],
          },
        },
      };
      client.replyMessage(ev.replyToken, flexMessage);
    } else if (text === "カレンダー") {
      // ----------------------
      // カレンダーイベントの追加
      // ----------------------
      const calId = "xs.kita4016@gmail.com";
      const event = {
        "start": {"dateTime": "2021-11-01T10:00:00+09:00"},
        "end": {"dateTime": "2021-11-01T12:00:00+09:00"},
        // ------------
        // 終日イベントの場合
        // "start": {"date": "2019-08-30"},
        // "end"  : {"date": "2019-08-30"},
        // ------------
        "summary": "カレンダーイベントのタイトル",
        "description": "カレンダーイベントの説明欄に表示する文章",
        // カレンダーで表示するイベントの色
        "colorId": 1,
        // 1:ラベンダ(薄紫)
        // 2:セージ(薄緑)
        // 3:ブドウ(濃紫)
        // 4:フラミンゴ(ピンク)
        // 5:バナナ
        // 6:みかん
        // 7:ピーコック(水色)
        // 8:グラファイト(灰色)
        // 9:ブルーベリー(濃青)
        // 10:バジル(濃緑)
        // 11:トマト
      };
      cal.Events.insert(calId, event)
          .then((resp) => {
            console.log(resp);
            client.replyMessage(ev.replyToken, {
              type: "text",
              text: "カレンダー追加ありがとうございます！",
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
    } else if (text === "日時選択") {
      const flexMessage = {
        "type": "flex",
        "altText": "何かのメッセージ",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "button",
                "action": {
                  "type": "datetimepicker",
                  "label": "日時選択",
                  "data": "datetime-select",
                  "mode": "datetime"
                }
              }
            ]
          }
        }
      };
      client.replyMessage(ev.replyToken, flexMessage);
    } else {
      client.replyMessage(ev.replyToken, {
        type: "text",
        text,
      });
    }
  };
  const handleFollowEvent = (ev) => {
    client.getProfile(ev.source.userId)
        .then((profile) => {
          const name = profile.displayName;
          client.replyMessage(ev.replyToken, {
            type: "text",
            text: `${name}さん友だち追加ありがとうございます！`,
          });
        });
  };
  const handlePostbackEvent = (ev) => {
    const data = ev.postback.data;
    if (data === "datetime-select") {
        const selectedDate = ev.postback.params.datetime;
        client.replyMessage(ev.replyToken, {
          type: "text",
          text: selectedDate,
        });
    }
  };
  exports.app = functions.https.onRequest(app);