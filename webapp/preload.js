const {
    contextBridge,
    ipcRenderer
} = require('electron')

const fs = require('fs');
const path = require('path')
const download = require('download');
const http = require("http")

var spawn = require('child_process').spawn;

const isReachable = require('is-reachable');

let tungstenoPid = null;

function getOS() {
    var os = process.platform;
    if (os == "darwin") {
        os = "macos";
    } else if (os == "win32" || os == "win64") {
        os = "windows";
    } else if (os == "linux") {
        os = "linux";
    }

    return os;
}

function getAppDataPath(localFile) {
    let versionFile = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
    return versionFile + path.sep + 'tungsteno' + path.sep + localFile;
}

function getInstalledVersion() {
    let installedInfo = getAppDataPath('version.json');

    try {
        if (fs.existsSync(installedInfo)) {
            let rawdata = fs.readFileSync(installedInfo);
            return JSON.parse(rawdata);
        }
    } catch (err) {}
    return null;
}

async function launchTungsteno() {
    let version = getInstalledVersion();
    let launchFile = getAppDataPath(version['Name']);

    tungstenoPid = spawn(launchFile, ['--launcher'], {
        detached: true,
    });

    console.log(tungstenoPid)
}

async function waitUntilTungstenoReachable() {
    return new Promise(async (resolve, reject) => {
        let reachable = await isReachable('http://localhost:8000');

        while (!reachable) {
            reachable = await isReachable('http://localhost:8000');
        }

        resolve();

    });

}

function initialSetup() {
    let dir = getAppDataPath('');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

async function downloadTungsteno(latestRelease, basePath) {
    initialSetup();

    await download(basePath + '/' + latestRelease['Name'], getAppDataPath(''));

    fs.writeFileSync(getAppDataPath('version.json'), JSON.stringify(latestRelease));

    fs.chmodSync(getAppDataPath(latestRelease['Name']), '755');

    return Promise.resolve();
}

function openOnDefaultBrowser(link) {
    console.log(link)
    require("electron").shell.openExternal(link);
}

contextBridge.exposeInMainWorld(
    'electron', {
        getOS: getOS,
        getInstalledVersion: getInstalledVersion,
        downloadTungsteno: downloadTungsteno,
        launchTungsteno: launchTungsteno,
        waitUntilTungstenoReachable: waitUntilTungstenoReachable,
        openOnDefaultBrowser: openOnDefaultBrowser,
    }
)