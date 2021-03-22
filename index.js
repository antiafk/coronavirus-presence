const { app, Menu, Tray } = require("electron"),
    path = require("path"),
    windows = require("./src/windows"),
    { version } = require("./package.json");

let mainWindow = null;
let tray = null;

app.whenReady().then(() => {
    mainWindow = windows.createMainWindow();
    tray = new Tray("resources/icon.ico");

    const contextMenu = Menu.buildFromTemplate([
        { label: "Coronavirus Presence v" + version, type: "normal", enabled: false },
        { type: "separator" },
        { label: "Open", type: "normal", click: () => mainWindow.show() },
        { label: "Exit", type: "normal", role: "quit" },
    ]);

    tray.setToolTip("Coronavirus Presence")
    tray.setContextMenu(contextMenu);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});