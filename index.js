import websocket from "websocket";
import http from "http";
const websocketServer = websocket.server;
const httpServer = http.createServer();
httpServer.listen(10000, "0.0.0.0", () => {console.log("Listening on 10000")});
const wsServer = new websocketServer({
  httpServer: httpServer,
});
wsServer.on("request", req => {
  const con = req.accept(null, req.origin);
  console.log("opened!");
  con.on("close", function () {
    console.log("closed!");
  });
  con.on("message", message => ((data = JSON.parse(message.utf8Data)) => {
    switch(data.type) {
      case "new":
      break;
      case "token":
        const url = `wss://${data.server}.moomoo.io/?token=${data.token}`;
      break;
    }
  })());
});

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

async function getToken() {
  console.log("called");
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v137.0.1/chromium-v137.0.1-pack.x64.tar'),
    headless: "shell",
  });

  const page = await browser.newPage();
  await page.goto("https://api.moomoo.io/verify");
  const content = await page.title();
  console.log(content);
  await browser.close();
}
getToken();