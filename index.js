import websocket from "websocket";
const websocketServer = websocket.server;
import http from "http";
const httpServer = http.createServer();
httpServer.listen(8000, "0.0.0.0", () => {console.log("Listening... on 4000")});
const wsServer = new websocketServer({
  httpServer: httpServer,
});
import puppeteer from "puppeteer";

wsServer.on("request", req => {
    console.log("Request!");
  const con = req.accept(null, req.origin);
  console.log("opened!");
  con.on("close", function () {
    console.log("closed!");
  });
  con.on("message", message => ((data = JSON.parse(message.utfData)) => {
    switch(data.type) {
      case "new":
        (async()=>{
          const browser = await puppeteer.launch({ headless: true });
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