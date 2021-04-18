const {
    contextBridge,
    ipcRenderer
} = require('electron')

const fs = require('fs');
const path = require('path')
const download = require('download');
const request = require("request")

const urlExists = url => new Promise((resolve, reject) => request.head(url).on("response", res => resolve(res.statusCode.toString()[0] === "2")))

var exec = require('child_process').exec;
const {
    get
} = require('http');

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

function launchTungsteno() {
    let version = getInstalledVersion();
    let launchFile = getAppDataPath(version['Name']);

    exec(launchFile + " --launcher", function (err, stdout, stderr) {
        if (err) {
            throw err;
        }
    })
}

async function waitUntilTungstenoReachable() {
    let exists = false;
    try {
        exists = await urlExists("http://localhost:8000");
    } catch {}

    while (!exists) {
        try {
            exists = await urlExists("http://localhost:8000");
        } catch {}
    }

    return Promise.resolve();

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

contextBridge.exposeInMainWorld(
    'electron', {
        getOS: getOS,
        getInstalledVersion: getInstalledVersion,
        downloadTungsteno: downloadTungsteno,
        launchTungsteno: launchTungsteno,
        waitUntilTungstenoReachable: waitUntilTungstenoReachable,
    }
)