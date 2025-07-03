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
      case "solve":
        (async()=> {
            console.log("solving...");
            const token = await solve(data.data);
            con.send(JSON.stringify({
                "type": "token",
                "token": token
            }));
            console.log("sent token!");
        })()
      break;
    }
  })());
});

import { solveChallengeWorkers } from "altcha-lib";

async function solve(data) {
    const result = await solveChallengeWorkers(
      "./node_modules/altcha-lib/dist/worker.js",
      8,
      data.challenge,
      data.salt,
      data.algorithm,
      data.maxnumber
    );
    const tokenObj = JSON.stringify({
      algorithm: data.algorithm,
      challenge: data.challenge,
      number: result.number,
      salt: data.salt,
      signature: data.signature,
      took: result.took
    });
    const token = btoa(tokenObj);
    return token;
}



