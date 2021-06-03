const { Client } = require("discord-rpc");
const getCases = require("./getCases");
const { version } = require("../package.json");

let client;
const clientId = "694203681851047957";

let timer;
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

async function onReady() {
    await updateRP();

    timer = setInterval(() => {
        updateRP();
    }, options.updateTime);

    enabled = true;
}

module.exports = {
    enable: function(config) {
        options = config;

        client = new Client({ transport: 'ipc' });
        client.once("ready", onReady);

        return client.login({ clientId });
    },
    disable: function() {
        enabled = false;

        if (timer) clearInterval(timer);

        return client.destroy();
    }
}