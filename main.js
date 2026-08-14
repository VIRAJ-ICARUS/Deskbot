const { app, BrowserWindow, ipcMain, screen } = require("electron");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 400,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,

        webPreferences: {
            preload: __dirname + "/preload.js",
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile("index.html");
}


// =========================
// WINDOW DRAGGING
// =========================

ipcMain.on("move-window", (event, x, y) => {

    const window = BrowserWindow.fromWebContents(event.sender);

    if (window) {
        window.setPosition(
            Math.round(x),
            Math.round(y)
        );
    }
});


// =========================
// GLOBAL MOUSE TRACKING
// =========================

let lastMouseX = null;
let lastMouseY = null;

setInterval(() => {

    if (!mainWindow || mainWindow.isDestroyed()) {
        return;
    }

    const point = screen.getCursorScreenPoint();

    // Only tell DeskBot when the cursor actually moved
    if (
        point.x !== lastMouseX ||
        point.y !== lastMouseY
    ) {
        lastMouseX = point.x;
        lastMouseY = point.y;

        mainWindow.webContents.send(
            "global-mouse-move",
            point
        );
    }

}, 100);


// =========================
// START
// =========================

app.whenReady().then(createWindow);