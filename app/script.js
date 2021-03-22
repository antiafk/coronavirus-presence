const remote = require("electron").remote,
windows = remote.require("./src/windows"),
presence = remote.require("./src/presence");

let enabled = true;

// config
let showGitHub = document.getElementById("showgithub"),
showUpdateTime = document.getElementById("showupdatetime"),
updateTime = document.getElementById("updatetime")
toggleText = document.getElementById("toggle-text")
toggleButton = document.getElementById("toggle");

function changesWarning() {
    if (enabled) {
        toggleText.innerHTML = "Disable and enable to apply the changes.";
        toggleText.style.color = "#fff152";
    }
}

function changePresence() {
    enabled = toggleButton.checked;

    if (enabled) {
        toggleText.innerHTML = "<i>Trying to connect...</i>";
        toggleText.style.color = "#fff";
        
        presence.enable({ showGitHub: showGitHub.checked, showUpdateTime: showUpdateTime.checked, updateTime: updateTime.value * 60000 })
        .then(() => {
            toggleText.innerHTML = "Connected.";
            toggleText.style.color = "#52ff57";
        })
        .catch(() => {
            setTimeout(changePresence, 5000);
        });
    } else {
        toggleText.innerHTML = "Disconnected.";
        toggleText.style.color = "#ff5252";
        presence.disable();
    }
}

toggleButton.addEventListener("input", () => changePresence());
showGitHub.addEventListener("input", () => changesWarning());
showUpdateTime.addEventListener("input", () => changesWarning());
updateTime.addEventListener("input", () => changesWarning());

document.getElementById("hideButton").addEventListener("click", e => remote.getCurrentWindow().hide())
document.getElementById("creditsButton").addEventListener("click", e => windows.createCreditsWindow());

changePresence();