const { BrowserWindow } = require("electron"),
path = require("path");

let creditsWindow = null;

module.exports = {
    createMainWindow: () => {
        const win = new BrowserWindow({
            width: 390,
            height: 295,
            center: true,
            resizable: false,
            frame: false,
            title: "Coronavirus Presence",
            icon: "resources/icon.ico",
            backgroundColor: "#282c30",
            webPreferences: {
                devTools: false,
                nodeIntegration: true,
                enableRemoteModule: true
            }
        });
        
        //win.webContents.openDevTools();
        win.removeMenu();
        win.loadFile(path.join(__dirname, "../app/index.html"));
        win.on("close", () => {
            if (creditsWindow) {
                creditsWindow.close();
            }
        });

        return win;
    },
    createCreditsWindow: () => {
        if (creditsWindow) {
            creditsWindow.show();
        } else {
            creditsWindow = new BrowserWindow({
                width: 400,
                height: 330,
                center: true,
                resizable: false,
                frame: false,
                title: "Coronavirus Presence",
                icon: "resources/icon.ico",
                backgroundColor: "#282c30",
                webPreferences: {
                    devTools: false,
                    nodeIntegration: true,
                    enableRemoteModule: true
                }
            });
        
            creditsWindow.removeMenu();
            creditsWindow.loadFile(path.join(__dirname, "../app/credits.html"));

            creditsWindow.on("close", () => {
                creditsWindow = null;
            });
        }
    }
}