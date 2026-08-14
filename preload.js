const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("deskbot", {

    // Move DeskBot window
    moveWindow: (x, y) => {
        ipcRenderer.send("move-window", x, y);
    },

    // Listen for mouse movement anywhere on the desktop
    onGlobalMouseMove: (callback) => {
        ipcRenderer.on("global-mouse-move", (event, point) => {
            callback(point);
        });
    }

});