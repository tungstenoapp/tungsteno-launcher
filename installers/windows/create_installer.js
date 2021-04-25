const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error)
        process.exit(1)
    })

function getInstallerConfig() {
    console.log('creating windows installer')
    const rootPath = path.join('./')

    const outPath = path.join(rootPath, 'build')

    return Promise.resolve({
        appDirectory: path.join(rootPath, 'build', 'tungsteno-launcher-win32-x64'),
        authors: 'José Carlos',
        noMsi: false,
        outputDirectory: path.join(outPath, 'windows-installer'),
        exe: 'tungsteno-launcher.exe',
        setupExe: 'TungstenoInstaller.exe',
        setupIcon: path.join(rootPath, 'assets', 'logo_app.ico')
    })
}