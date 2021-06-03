const remote = require("electron").remote,
windows = remote.require("./src/windows"),
presence = remote.require("./src/presence");

let enabled = false;

// config
let showGitHub = document.getElementById("showgithub"),
showUpdateTime = document.getElementById("showupdatetime"),
updateTime = document.getElementById("updatetime")
toggleText = document.getElementById("toggle-text")
toggleButton = document.getElementById("toggle");

let reconnectTimer;

function changesWarning() {
    if (enabled) {
        toggleText.innerHTML = "Disable and enable to apply the changes.";
        toggleText.style.color = "#fff152";
    }
}

function changePresence() {
    if (toggleButton.checked) {
        toggleText.innerHTML = "<i>Trying to connect...</i>";
        toggleText.style.color = "#fff";
        
        if (enabled) presence.disable();
        
        presence.enable({ showGitHub: showGitHub.checked, showUpdateTime: showUpdateTime.checked, updateTime: updateTime.value * 60000 })
        .then(() => {
			enabled = true;
            toggleText.innerHTML = "Connected.";
            toggleText.style.color = "#52ff57";
        })
        .catch(e => {
            console.error(e);
            reconnectTimer = setTimeout(changePresence, 5000);
        });
    } else {
        toggleText.innerHTML = "Disconnected.";
        toggleText.style.color = "#ff5252";
        if (enabled) presence.disable();
        if (reconnectTimer) clearTimeout(reconnectTimer);
    }
}

toggleButton.addEventListener("input", () => changePresence());
showGitHub.addEventListener("input", () => changesWarning());
showUpdateTime.addEventListener("input", () => changesWarning());
updateTime.addEventListener("input", () => changesWarning());

document.getElementById("hideButton").addEventListener("click", e => remote.getCurrentWindow().hide())
document.getElementById("creditsButton").addEventListener("click", e => windows.createCreditsWindow());

changePresence();