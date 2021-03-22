const RPC = require("discord-rpc");
const getCases = require("./getCases");
const { version } = require("../package.json");

const client = new RPC.Client({ transport: 'ipc' });
const clientId = "694203681851047957";

let enabled = false;
let options;
let startTime;
let endTime;

async function updateRP() {
    values = await getCases();

    startTime = Date.now();
    endTime = Date.now() + options.updateTime;

    let activity = {
        details: `Total cases: ${values[0]}`,
        state: `Deaths: ${values[1]}  Recovered: ${values[2]}.`,
        largeImageKey: "cv",
        largeImageText: "Coronavirus Presence v" + version
    }

    if (options.showGitHub) {
        activity.buttons = [
            { label: "GitHub Repository", url: "https://github.com/antiafk/coronavirus-presence" }
        ];
    }

    if (options.showUpdateTime) {
        activity.startTimestamp = startTime;
        activity.endTimestamp = endTime;
    }

    client.setActivity(activity);
}

client.on("ready", async () => {
    await updateRP();

    timer = setInterval(() => {
        updateRP();
    }, options.updateTime);

    enabled = true;
});

module.exports = {
    enable: function(config, callback) {
        options = config;

        return client.login({ clientId });
    },
    disable: function() {
        if (enabled) {
            enabled = false;

            clearInterval(timer);
            client.clearActivity();
        }
    }
}