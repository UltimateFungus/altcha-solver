const rawData = await fetch('https://corsproxy.io/?url=' + "https://api.moomoo.io/verify");
const data = await rawData.json();

const res = await fetch("http://localhost:10000/token", {
    headers: {'content-type' : 'application/json'},
    method: "POST",
    body: JSON.stringify(data)
});

const token = await res.text();
console.log(token);