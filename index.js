const {
  app,
  BrowserWindow,
  Menu
} = require('electron')
const path = require('path')
const contextMenu = require('electron-context-menu');

contextMenu({
  prepend: (defaultActions, parameters, browserWindow) => [{
      label: 'Rainbow',
      // Only show it when right-clicking images
      visible: parameters.mediaType === 'image'
    },
    {
      label: 'Search Google for “{selection}”',
      // Only show it when right-clicking text
      visible: parameters.selectionText.trim().length > 0,
      click: () => {
        shell.openExternal(`https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`);
      }
    }
  ]
});


function createWindow() {
  const win = new BrowserWindow({
    width: 650,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'webapp', 'preload.js'),
      nodeIntegration: true,
    }
  })

  win.setMenuBarVisibility(false)

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