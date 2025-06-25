import websocket from "websocket";
const websocketServer = websocket.server;
import http from "http";
const httpServer = http.createServer();
httpServer.listen(10000, "0.0.0.0", () => {console.log("Listening on 10000")});
const wsServer = new websocketServer({
  httpServer: httpServer,
});
import chromium from "@sparticuz/chromium-min"
import puppeteer from "puppeteer-core";
chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;
wsServer.on("request", req => {
  const con = req.accept(null, req.origin);
  console.log("opened!");
  con.on("close", function () {
    console.log("closed!");
  });
  con.on("message", message => ((data = JSON.parse(message.utf8Data)) => {
    switch(data.type) {
      case "new":
        (async()=>{
          const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless
          });
          const page = await browser.newPage();
          await page.goto("https://api.moomoo.io/verify", { waitUntil: "domcontentloaded" });
          const content = await page.content();
          console.log(content);
        })();
      break;
      case "token":
        const url = `wss://${data.server}.moomoo.io/?token=${data.token}`;
      break;
    }
  })());
});