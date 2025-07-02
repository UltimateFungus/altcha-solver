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



async function getToken() {
  const data = await fetch("https://api.moomoo.io/verify");
  const parsed = await data.json();
  console.log(parsed);
}
getToken();