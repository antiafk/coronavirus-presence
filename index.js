const RPC = require("discord-rpc");
const https = require("https");
const cheerio = require("cheerio");

const client = new RPC.Client({ transport: 'ipc' });
const clientId = "694203681851047957";

const updateTime = 5*60000;

let values = [];

function request() {
    return new Promise ((resolve, reject) => {
        let data = "";
        https.get("https://www.worldometers.info/coronavirus/", res => {
            res.on("data", c => {
                data += c;
            });

            res.on("end", () => {
                resolve(cheerio.load(data));
            });

            res.on("error", reject);
        });
    });
}

async function cases() {
    let covid = await request();

    let result = []
    covid(".maincounter-number").map((i, el) => {
        result.push(el.children[0].next.children[0].data.replace(/[,\s]+/g, ""))
    });
    return result;
}

async function updateRP() {
    values = await cases();
    
    let startTime = new Date();
    let endTime = new Date(startTime.getTime() + updateTime);

    client.setActivity({
        details: `Total cases: ${values[0]},`,
        state: `Deaths: ${values[1]}, Recovered: ${values[2]}.`,
        startTimestamp: startTime,
        endTimestamp: endTime,
        largeImageKey: "cv",
        largeImageText: "Coronavirus Status"
    });
}

client.on("ready", async () => {
    await updateRP();
    console.log(`Total cases: ${values[0]}, Deaths: ${values[1]}, Recovered: ${values[2]}.`)
    setInterval(() => updateRP(), updateTime);
});

client.login({ clientId }).catch(console.error);