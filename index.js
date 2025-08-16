import express from "express";
import cors from "cors";

const app = express();
const PORT = 10000;

app.use(cors());
app.use(express.json());

app.post("/token", (req, res) => {
    !!req.body ? (
        console.log("solving...");
        solve(req.body).then(token => {
        console.log("sent");
        res.send(token);
    })) : console.log("missing challenge!");
});

app.listen(
    PORT,
    () => console.log(`Listening on ${PORT}`)
)

import { solveChallenge, solveChallengeWorkers } from "altcha-lib";

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



