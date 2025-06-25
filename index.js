import websocket from "websocket";
const websocketServer = websocket.server;
import http from "http";
const httpServer = http.createServer();
httpServer.listen(4000, function () {
  console.log("Listening... on 4000");
});
const wsServer = new websocketServer({
  httpServer: httpServer,
});
import puppeteer from "puppeteer";

wsServer.on("request", (request) => {
  //connect
  const connection = request.accept(null, request.origin);
  console.log("opened!");
  connection.on("close", function () {
    console.log("closed!");
  });
  connection.on("message", function (message) {
    const data = JSON.parse(message.utf8Data);
    switch(data.type) {
      case "new":
        (async()=>{
          const browser = await puppeteer.launch({ headless: true, args:[
                  '--disable-setuid-sandbox',
                  '--no-sandbox'
          ]});
          const page = await browser.newPage();
          await page.goto("https://api.moomoo.io/verify", { waitUntil: "domcontentloaded" });
          const content = await page.content();
          console.log(content);
        })();
      break;
      case "token":
        const url = `wss://${data.server}.moomoo.io/?token=${data.token}`;
        new Bot(url);
      break;
    }
  });
});