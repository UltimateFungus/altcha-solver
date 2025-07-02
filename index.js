import env from "dotenv";
env.config({path: "./.env.local"});

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

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import chromium from "@sparticuz/chromium-min";

puppeteer.use(StealthPlugin());

async function getToken() {
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  const browser = await puppeteer.launch({
    args: isLocal ? puppeteer.defaultArgs() : [...chromium.args, "--hide-scrollbars", "--incognito", "--no-sandbox", '--disable-blink-features=AutomationControlled'],
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v137.0.1/chromium-v137.0.1-pack.x64.tar'),
    headless: false,
    ignoreHTTPSErrors: true
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Cookie':'OptanonAlertBoxClosed=2025-05-25T11:20:10.611Z; eupubconsent-v2=CQR9o3AQR9o3AAcABBENBsFsAP_gAEPgAChQLPtT_G__bWlr-T73aftkeYxP99h77sQxBgbJE-4FzLvW_JwXx2E5NAzatqIKmRIAu3TBIQNlHJDURVCgaogVryDMaEyUoTNKJ6BkiFMRI2NYCFxvm4tjeQCY5vr991c1mB-t7dr83dzyy4hHn3a5_2S1WJCdAYetDfv8bBOT-9IOd_x8v4v4_F7pE2-eS1n_pWvp7D9-Yls_9X299_bbff7Pn_ful_-_X_vf_n37v943n77v__gs8ACYaFRBGWRACESgYQQIAFBWEBFAgCAABIGiAgBMGBTkDABdYSIAQAoABggBAACDAAEAAAkACEQAUAFAgAAgECgADAAgGAgAYGAAMAFgIBAACA6BimBBAIFgAkZkUGmBKAAkEBLZUIJAECCuEIRZ4BBAiJgoAAAQACgAAQHgsBiSQErEggC4gmgAAIAAAogQIEUnZgCCgM2WovBk-jK0wDB8wTNKYBkARBGRkmxCb9ph45CiEAAA.f_wACHwAAAAA; _frvr=866e8fe3-c282-07b5-fd48-197072c94926; _pubcid=b18ebe1a-1cac-4d0f-af7f-2660b6c19f2b; _pubcid_cst=%2BywVLLQsqQ%3D%3D; _cc_id=3b609910c176c90f7d97a0fec5cb0468; cto_bidid=SQU7XF9GWjhsUW5PZWhxWUNkVGlHT01wcWFhaEJWUFowWVJDa0pYeDglMkZZcGZSN3p1QmJBeHdKajJ6ZHcyUTJEaXlmd1glMkZ1eXVYJTJGMmF2WWxYaHZtaFZvZjJUdDFobWZNY0RIejlqTmVGJTJCWHNnJTJCWmslM0Q; OptanonConsent=isGpcEnabled=1&datestamp=Wed+Jul+02+2025+14%3A31%3A59+GMT%2B0200+(Central+European+Summer+Time)&version=202310.1.0&browserGpcFlag=1&isIABGlobal=false&hosts=&consentId=a88a76b2-0564-4f82-82cd-820532fd62a8&interactionCount=2&landingPath=NotLandingPage&groups=C0002%3A1%2CC0004%3A1%2CC0003%3A1%2CC0001%3A1%2CV2STACK42%3A1&AwaitingReconsent=false&geolocation=%3B; cto_bundle=7Z7d5V9pc045c3YyZ1F5aUxZd1BqRER0dXN3RWdkWEVwemUwT0RqOUw4JTJCeHhGOVJkZVQlMkZrNWIxY2xBYlNOJTJCSk13cmQyMjRWYmNaN2QlMkJzRUlyTUVheWg5S0UyJTJGaklJREt1VXZxbU1ZSk9CMlU0ZzU3UVBlekpWdWlOc20xNml3cldXMnFNYjRrRjNzSE5SdmowTVhVeUV3RXp3JTNEJTNE'
  });
  await page.setViewport({
    width: 1280 + Math.floor(Math.random() * 100),
    height: 800 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false
  });
  await page.goto("https://api.moomoo.io/verify", { waitUntil: "networkidle2" });
  const content = await page.content();
  console.log(content);
  await browser.close();
}
getToken();