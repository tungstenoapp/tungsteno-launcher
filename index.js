const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'webapp', 'preload.js'),
      nodeIntegration: true,
    }
  })

  // win.setMenuBarVisibility(false)

  win.loadFile('webapp/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})