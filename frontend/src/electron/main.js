import { app, BrowserWindow, ipcMain, session } from "electron";
import path from "path";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    height: 720,
    width: 1280,
    fullscreen: false,
    minimizable: false,
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'geolocation') {
      callback(true);
    } else {
      callback(false);
    }
  });

  mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
});

ipcMain.on("quit-app", () => {
  app.quit();
});
